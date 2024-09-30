import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const response = await axios.post("http://localhost:8000/users/", req.body);
      res.status(200).json(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Error creating user";
      res.status(400).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
