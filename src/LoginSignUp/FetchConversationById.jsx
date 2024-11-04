import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FetchConversationById = () => {
  const [conversations, setConversations] = useState([]);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      // Redirect to login if userId is not available
      navigate('/');
    } else {
      fetch(`https://localhost:7043/Conversation/IdUser/${userId}`)
        .then(response => response.json())
        .then(data => {
          setConversations(data["$values"]);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    // Clear session or token here
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      userId: userId, // Include the userId in the request data
      conversationId: 0,
      userInput: question
    };

    try {
      const res = await fetch('https://localhost:7043/api/OpenAI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setResponse(result.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + error.message);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <div id="data-container">
        {conversations.map(conversation =>
          conversation.questions["$values"].map(question => (
            <div key={question.questionContent}>
              <h2>Question Content: {question.questionContent}</h2>
              <p>Message: {question.responses["$values"][0].message}</p>
            </div>
          ))
        )}
      </div>
      <h1>Ask a Question</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label htmlFor="question" style={{ display: 'block', margin: '10px 0' }}>Question:</label>
        <input
          type="text"
          id="question"
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit" style={{ display: 'block', margin: '10px 0' }}>Submit</button>
      </form>
      <h2>Response:</h2>
      <p>{response}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default FetchConversationById;
