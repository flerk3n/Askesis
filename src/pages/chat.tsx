const handleSend = async (userMessage: string) => {
  // ... existing code ...
  // Get teacher response as array of chunks
  const teacherChunks = await getGeminiResponse(selectedSubject, updatedMessages);

  // Display each chunk with a delay
  for (const chunk of teacherChunks) {
    setMessages(prev => [
      ...prev,
      { role: 'teacher', content: chunk }
    ]);
    await new Promise(res => setTimeout(res, 1200)); // 1.2s delay
  }
}; 