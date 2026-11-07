import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type Task = {
  id: string;
  title: string;
  done: boolean;
  day?: Day;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (title: string, day?: Day) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearDone: () => void;
  editTask: (id: string, title: string) => void;
  resetTasks: () => void;
};

const STORAGE_KEY = 'taskflow-tasks';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
  { id: '1', title: 'Learn React Native', done: false },
  { id: '2', title: 'Practice JavaScript', done: false },
  { id: '3', title: 'Build TaskFlow', done: false },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setTasks(JSON.parse(saved));
        }
      } catch (error) {
        console.warn('Could not load tasks', error);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((error) =>
      console.warn('Could not save tasks', error)
    );
  }, [tasks, loaded]);

  const addTask = (title: string, day?: Day) => {
    setTasks((current) => [
      { id: Date.now().toString(), title, done: false, day },
      ...current,
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const clearDone = () => {
    setTasks((current) => current.filter((task) => !task.done));
  };

  const editTask = (id: string, title: string) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  const resetTasks = () => {
    setTasks(initialTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        clearDone,
        editTask,
        resetTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used inside a TaskProvider');
  }
  return context;
}