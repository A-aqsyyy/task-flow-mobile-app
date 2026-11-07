import { useState } from 'react';
import { View, Pressable, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useColors } from '../../context/useColors';

type Props = {
  title: string;
  done: boolean;
  day?: string;
  onPress: () => void;
  onDelete: () => void;
  onEdit: (title: string) => void;
};

export default function TaskItem({
  title,
  done,
  day,
  onPress,
  onDelete,
  onEdit,
}: Props) {
  const colors = useColors();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const startEditing = () => {
    setDraft(title);
    setEditing(true);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed !== '') onEdit(trimmed);
    setEditing(false);
  };
    const confirmDelete = () => {
    Alert.alert('Delete task?', `"${title}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: done ? colors.cardDone : colors.card },
      ]}
    >
      {editing ? (
        <TextInput
          style={[
            styles.editInput,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={save}
          onBlur={save}
          autoFocus
        />
      ) : (
        <Pressable
          style={styles.textArea}
          onPress={onPress}
          onLongPress={startEditing}
        >
          <Text
            style={[
              styles.taskText,
              { color: done ? colors.subtext : colors.text },
              done && styles.textDone,
            ]}
          >
            {title}
          </Text>
          {day ? <Text style={styles.dayLabel}>{day}</Text> : null}
        </Pressable>
      )}

      <Pressable style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
  },
  textArea: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  textDone: {
    textDecorationLine: 'line-through',
  },
  dayLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});