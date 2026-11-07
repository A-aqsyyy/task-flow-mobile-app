import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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

type Row = {
  id: string;
  title: string;
  done: boolean;
  day: string | null;
};

const COLUMNS = 'id, title, done, day';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function toTask(row: Row): Task {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    day: (row.day ?? undefined) as Day | undefined,
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select(COLUMNS)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not load tasks', error.message);
      return;
    }
    setTasks((data as Row[]).map(toTask));
  };

  // Load this user's tasks when they sign in, clear them when they sign out
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }
    loadTasks();
  }, [userId]);

  const addTask = async (title: string, day?: Day) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, day: day ?? null })
      .select(COLUMNS)
      .single();

    if (error) {
      console.warn('Could not add task', error.message);
      return;
    }
    setTasks((current) => [toTask(data as Row), ...current]);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

    const { error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', id);

    if (error) {
      console.warn('Could not update task', error.message);
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((current) => current.filter((t) => t.id !== id));

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.warn('Could not delete task', error.message);
      loadTasks();
    }
  };

  const clearDone = async () => {
    setTasks((current) => current.filter((t) => !t.done));

    const { error } = await supabase.from('tasks').delete().eq('done', true);

    if (error) {
      console.warn('Could not clear done tasks', error.message);
      loadTasks();
    }
  };

  const editTask = async (id: string, title: string) => {
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, title } : t))
    );

    const { error } = await supabase.from('tasks').update({ title }).eq('id', id);

    if (error) {
      console.warn('Could not edit task', error.message);
      loadTasks();
    }
  };

  const resetTasks = async () => {
    if (!userId) return;
    setTasks([]);

    const { error } = await supabase.from('tasks').delete().eq('user_id', userId);

    if (error) {
      console.warn('Could not reset tasks', error.message);
      loadTasks();
    }
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