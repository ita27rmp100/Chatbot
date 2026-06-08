$(document).ready(function () {
    $('#ChatInput').focus();
    const $chatForm = $('#chatForm');
    const $chatInput = $('#chatInput');
    const $chatBody = $('#chatBody');
    const $chatEmpty = $('#chatEmpty');

    $chatInput.focus();

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
        return $.ajax({
            url: "http://localhost:3000/ai-response",
            method: "POST",
            contentType:"application/json",
            data:JSON.stringify({
                content:userText
            }),
            success: function(response) {
                reply = response
            },
            error: function(xhr, status, error) {
                reply = error
            }
        });
    }

    $chatForm.on('submit', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        const message = $chatInput.val().trim();
        if (!message) {
            return false;
        }

        addMessage(message, 'user');
        $chatInput.val('').focus();

        try{
            const reply = await getBotReply(message);
            addMessage(reply.response, 'bot');
        }
        catch(err){
            addMessage("Error contacting server", 'bot');
            console.error(err);
        }
    });
});