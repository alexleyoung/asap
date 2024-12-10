from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database import schemas
import os
from dotenv import load_dotenv
from .crud import users, tasks, events
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


# to pass schedule items to LLM
def get_user_context(user_id: int, db: Session = Depends(get_db)):
    db_user = users.get_user(db, userID=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_tasks = tasks.get_tasks(db, userID=user_id)
    user_events = events.get_events_by_user(db, userID=user_id)

    # Format data and make string.
    context = f"User: {db_user.firstname}{db_user.lastname}\n\nTasks:\n"
    for task in user_tasks:
        context += f"- {task.title}: {task.description}. This task is currently scheduled to start at {task.start} and end at {task.end} although these values are not necessary to respect. The task is categorized as {task.category} and recurs with frequency {task.frequency}. It is due (non-negotiable) at {task.dueDate}, with a priority of {task.priority}, a difficulty of {task.difficulty}, a duration of {task.duration}, and it is {task.flexible} that it is flexible.\n"

    context += "Events:\n"
    for event in user_events:
        context += f"- {event.title}: {event.description}. Event starts at {event.start} and ends at {event.end}. It is categorized as {event.category} and recurs every {event.frequency} at location {event.location}\n"
    return context


def query(context_data: str, given_task: schemas.TaskCreate):

    # Create a prompt template
    prompt_template = PromptTemplate(
        input_variables=["context", "task"],
        template="""
        Given the rest of the non-mutable tasks and events in this user's schedule:
        {context}

        What is the best start and end time for this specific task to maximize this user's productivity? Both start and end time must be before the given due date.
        {task}

        Please return a start and end time for this task in ISO 8601 format, with a comma between start and end time. Do not provide any explanation or other information.
        """,
    )

    load_dotenv()
    key = os.getenv("OPENAI_API_KEY")
    if key is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key not found",
        )
    # Initialize Langchain with OpenAI
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=key,
    )
    chain = LLMChain(prompt=prompt_template, llm=llm)

    # Query OpenAI with context data and user query
    response = chain.run(
        context=context_data, task=given_task
    )  # the response will be a datetime
    rp = response.split(",")
    given_task.start = rp[0]
    given_task.end = rp[1]
    return given_task
