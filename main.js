document.addEventListener("DOMContentLoaded", function() {
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");
    const chatLog = document.querySelector(".chat-log");
    const imageUpload = document.getElementById("image-upload");
    const fileName = document.querySelector(".file-name");
    const imagePreview = document.querySelector(".image-preview");

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    imageUpload.addEventListener("change", handleImageUpload);

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== "") {
            appendMessage("outgoing", message); // Append user's message to chat log
            messageInput.value = "";

            const response = await completeMessage(message);
            appendMessage("incoming", response);
        }
    }
const api_key="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";
async function completeMessage(message) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-0613", // Specify the GPT-3.5 model
                prompt: message,
                max_tokens: 50, // Adjust as needed
                temperature: 0.7 // Adjust as needed
            })
        });
        const data = await response.json();
        if (response.ok) {
            return data.choices[0].text.trim();
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Error completing message:', error);
        return "Hello! I'm Vibot, your plant health consultant. 🌱 Please describe your plant species and any issues observed, so we can diagnose and create a plan for optimal health together!";
    }
}


    function appendMessage(type, content) {
        const messageItem = document.createElement("li");
        messageItem.classList.add("chat", type);

        if (typeof content === "string") {
            const messageContent = document.createElement("p");
            messageContent.textContent = content;
            messageItem.appendChild(messageContent);
        } else if (content instanceof HTMLElement) {
            messageItem.appendChild(content);
        }

        chatLog.appendChild(messageItem);
        chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to bottom of chat log
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            console.log("Uploaded image:", file); // Log the uploaded image
            fileName.textContent = file.name; // Display the selected file name
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement("img");
                img.src = e.target.result;

                // Append the image to the chat log as a message
                appendMessage("outgoing", img);
            }
            reader.readAsDataURL(file);
        }
    }
});
