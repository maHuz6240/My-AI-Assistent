let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;

let Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAwsCAZvTZXJJKa80eqyZfGoczSdXdJx7k";

// Function to create chat box
function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// Function to get API response
async function getApiResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".text");
    try {
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{ "text": userMessage }]
                }]
            })
        });

        let data = await response.json();  // Await for response.json() to get correct data
        let apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;  // Optional chaining to avoid errors

        if (apiResponse) {
            textElement.innerText = apiResponse;
            let aiResponseHtml = `<div class="img"><img src="ai.png" alt="" width="50px"></div><p class="text">${apiResponse}</p>`;
            let aiChatBoxResponse = createChatBox(aiResponseHtml, "ai-chat-box");
            chatContainer.appendChild(aiChatBoxResponse); // Add AI response chat box
        } else {
            console.log("No valid response found from API");
        }
    } catch (error) {
        console.log("Error:", error);
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";  // Hide loading icon
    }
}

// Function to show loading indicator
function showLoading() {
    let html = `<div class="img">
                    <img src="ai.png" alt="" width="50px">
                </div>
                <p class="text"></p>
                <img class="loading" src="loading.gif" alt="loading" height="50">`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);  // Fetch the response from the API
}

btn.addEventListener("click", () => {
    userMessage = prompt.value.trim();  // Trim to avoid empty spaces as message
    if (userMessage === "") {
        container.style.display = "flex";
        return;
    } else {
        container.style.display = "none";
    }

    // Create and display the user's message chat box
    let html = `<div class="img">
                    <img src="user.png" alt="" width="50px">
                </div>
                <p class="text">${userMessage}</p>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);  // Add user message chat box

    prompt.value = "";  // Clear the input field

    // Clear previous responses and show the loading indicator
    setTimeout(() => {
        chatContainer.querySelectorAll(".ai-chat-box").forEach(box => box.remove()); // Remove old AI chat boxes
        showLoading();  // Show loading indicator and wait for the API response
    }, 500);  // Delay to ensure chat box is added before showing loading
});
