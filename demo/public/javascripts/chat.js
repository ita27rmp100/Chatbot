$(document).ready(function () {
  const $chatForm = $('#chatForm');
  const $chatInput = $('#chatInput');
  const $chatBody = $('#chatBody');
  const $chatEmpty = $('#chatEmpty');

  const botResponses = [
  'Hello! How can I help you today?',
  'That sounds interesting. Tell me more.',
  'I can answer simple questions or help you explore ideas.',
  'Thanks for your message! Anything else on your mind?',
  'I am a simple chatbot UI. You can type any question and I will reply.'
];

function addMessage(content, type) {
  if ($chatEmpty.length) {
    $chatEmpty.hide();
  }

  const commonClasses = 'max-w-[78%] rounded-3xl px-5 py-4 mb-1 text-sm leading-6 break-words shadow-sm';
  const $message = $('<div></div>');
  $message.addClass(commonClasses);

  if (type === 'user') {
    $message.addClass('mr-auto bg-slate-950 text-slate-100 rounded-bl-md');
  } else {
    $message.addClass('ml-auto bg-slate-300 text-slate-950 rounded-br-md');
  }

  $message.text(content);
  $chatBody.append($message);
  $chatBody.scrollTop($chatBody[0].scrollHeight);
}

function getBotReply(userText) {
  const normalized = userText.trim().toLowerCase();

  if (!normalized) {
    return 'Please type something so I can reply.';
  }

  if (normalized.includes('hello') || normalized.includes('hi')) {
    return 'Hi there! What would you like to talk about?';
  }

  if (normalized.includes('help')) {
    return 'Sure! I can help with simple questions and small talk.';
  }

  if (normalized.includes('how are you')) {
    return 'I am doing great, thanks! How about you?';
  }

  if (normalized.includes('chatbot')) {
    return 'I am a chatbot UI demo built for this page.';
  }

  return botResponses[Math.floor(Math.random() * botResponses.length)];
}

$chatForm.on('submit', function (event) {
  event.preventDefault();
  event.stopPropagation();

  const message = $chatInput.val().trim();
  if (!message) {
    return false;
  }

  addMessage(message, 'user');
  $chatInput.val('').focus();

  setTimeout(() => {
    const reply = getBotReply(message);
    addMessage(reply, 'bot');
  }, 600);

  return false;
});
});
