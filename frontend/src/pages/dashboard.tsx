import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from "../components/Navbar";
import goalService from '../services/goalService';

interface Goal {
  id: string;
  text: string;
  completed: boolean; // Ensure this field is returned by your backend
}

const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<string>('');
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [editGoalText, setEditGoalText] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setToken(user.token || null);
    } else {
      console.log("No user found in local storage");
    }
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      if (token) {
        try {
          const fetchedGoals = await goalService.getGoals(token);
          setGoals(fetchedGoals.map((goal: any) => ({
            id: goal._id,
            text: goal.text,
            completed: goal.completed || false
          })));
        } catch (error) {
          console.error('Error fetching goals:', error);
          // Handle error feedback to user if needed
        }
      }
    };

    fetchGoals();
  }, [token]);

  const handleAddGoal = async () => {
    if (newGoal.trim() !== '' && token) {
      try {
        const newGoalData = await goalService.postGoal({ text: newGoal, completed: false }, token);
        setGoals([...goals, { id: newGoalData._id, text: newGoalData.text, completed: newGoalData.completed }]);
        setNewGoal('');
      } catch (error) {
        console.error('Error adding goal:', error);
        // Handle error feedback to user if needed
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (token) {
      try {
        await goalService.deleteGoal(id, token);
        setGoals(goals.filter(goal => goal.id !== id));
      } catch (error) {
        console.error('Error deleting goal:', error);
        // Handle error feedback to user if needed
      }
    }
  };

  const handleEditGoal = (id: string, text: string) => {
    setEditGoalId(id);
    setEditGoalText(text);
  };

  const handleSaveEdit = async () => {
    if (editGoalText.trim() !== '' && editGoalId && token) {
      try {
        const updatedGoal = await goalService.putGoal(editGoalId, { text: editGoalText, completed: false }, token);
        setGoals(goals.map(goal =>
          goal.id === editGoalId ? { ...goal, text: updatedGoal.text } : goal
        ));
        setEditGoalId(null);
        setEditGoalText('');
      } catch (error) {
        console.error('Error updating goal:', error);
        // Handle error feedback to user if needed
      }
    }
  };

  const handleCancelEdit = () => {
    setEditGoalId(null);
    setEditGoalText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setToken(null);
    navigate('/');
  };

  return (
    <>
      <Navbar
        title="GOALS"
        onLogout={handleLogout}
        avatarSrc="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
      />
      <div className="flex flex-col items-center p-4 w-full">
        <div className="mb-4 flex items-center w-full max-w-lg">
          <input
            type="text"
            placeholder="New Goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            style={{ backgroundColor: 'white', color: 'black' }}
          />
          <button
            onClick={handleAddGoal}
            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          >
            Add
          </button>
        </div>
        <ul className="w-full max-w-lg">
          {goals.map(goal => (
            <li key={goal.id} className={`flex items-center justify-between p-2 border-b ${goal.completed ? 'line-through' : ''}`} style={{ color: 'black' }}>
              {editGoalId === goal.id ? (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={editGoalText}
                    onChange={(e) => setEditGoalText(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    style={{ backgroundColor: 'white', color: 'black' }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white py-2 px-4 rounded ml-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="flex-1">{goal.text}</span>
              )}
              <div className="flex items-center">
                <IconButton edge="end" onClick={() => handleEditGoal(goal.id, goal.text)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteGoal(goal.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
