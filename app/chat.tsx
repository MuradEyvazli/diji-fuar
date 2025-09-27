import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useNetworking } from '@/contexts/NetworkingContext';

interface Message {
  id: string;
  senderId: number | 'me';
  message: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const { personId, name } = useLocalSearchParams();
  const { conversations, sendMessage, people } = useNetworking();
  const [messageText, setMessageText] = useState('');

  const chatPersonId = parseInt(personId as string);
  const chatPersonName = decodeURIComponent(name as string);
  const messages = conversations[chatPersonId] || [];
  const person = people.find(p => p.id === chatPersonId);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(chatPersonId, messageText.trim());
      setMessageText('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === 'me';

    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.theirMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessageBubble : styles.theirMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatPersonName}</Text>
          {person && (
            <Text style={styles.headerStatus}>
              {person.status === 'online' ? '🟢 Çevrimiçi' :
               person.status === 'away' ? '🟡 Uzakta' : '⚫ Çevrimdışı'}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        inverted={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Empty State */}
      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
          <Text style={styles.emptyDescription}>
            {chatPersonName} ile konuşmaya başlayın
          </Text>
        </View>
      )}

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Mesajınızı yazın..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  profileButton: {
    padding: 8,
  },
  profileButtonText: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#3498db',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#2c3e50',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: '#bdc3c7',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#95a5a6',
    textAlign: 'left',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3498db',
  },
  sendButtonInactive: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});