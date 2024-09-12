import sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///memory", echo = True)
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

class User(Base):
    __tablename__ = "divya's test table"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    fullname = Column(String)
    nickname = Column(String)
    def __repr__(self):
        return "<User(name='%s', fullname='%s', nickname='%s')>" % (
            self.name,
            self.fullname,
            self.nickname,
        )

#print(User.__table__)

Base.metadata.create_all(engine)

first_user = User(name = "divya", fullname = "divya lidder", nickname = "divvy")
#print(first_user.nickname)   #returns "divvy"
#print(str(first_user.id))    #return "none"

session.add(first_user)
select_user = session.query(User).first()
#print(select_user.name) #returns "divya"
#print(first_user is select_user) #returns true

session.add_all(
    [
        User(name = "caiti", fullname = "caiti harts", nickname = "pookie"),
        User(name = "kaylee", fullname = "kaylee maczek", nickname = "kayleaf"),
        User(name = "alex", fullname = "alex young", nickname = "alexander the great")
    ]
)
first_user.nickname = "dslidder"

#print(session.dirty) #returns IdentitySet for user divya that has been changed
#print(session.new) #returns IdentitySet for the three new users

for instance in session.query(User).order_by(User.name):
    print(instance.name) #alphabetical ordered names

for name, nickname in session.query(User.name, User.nickname):
    print(name, ":", nickname)