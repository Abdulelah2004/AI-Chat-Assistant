import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `

General Information:
Name: Abdulelah Ahmed
Profession: Web Developer | Student at Universitas Singaperbangsa Karawang (UNSIKA), Indonesia
Website: www.abdulelah.dev (replace with your actual domain if available)
Email: abdulelah.ahmed@example.com  (replace with your real email)
Phone: +62 XXX-XXXX-XXXX  (replace with your Indonesian number if you want)

Services:
- Frontend Development (HTML, CSS, JavaScript, React, Tailwind)
- Backend Development (Node.js, Express, MongoDB)
- Responsive Website & UI/UX Design
- API Integration & Automation
- Student Projects & Collaboration Opportunities

Availability:
- Monday to Friday: 9:00 AM – 6:00 PM (WIB, Indonesia Time)
- Saturday: By Appointment
- Sunday: Closed

FAQs:
General:
What services do you offer?
I specialize in modern web development, including frontend, backend, and responsive design.

Do you work with international clients?
Yes, I collaborate with clients worldwide through online meetings, email, and project platforms.

How can I start a project with you?
You can email me at abdulelah.ahmed@example.com with your project idea, and I’ll respond with next steps.

Do you provide ongoing support?
Yes, I offer ongoing maintenance, updates, and technical support for deployed projects.

Location (Indonesia):
Where are you based?
I’m based in Karawang, Indonesia while studying Informatics Engineering at UNSIKA.

Do you offer in-person meetings?
Yes, I’m available for in-person meetings around Karawang or Jakarta. Online meetings are also possible.

Tone Instructions:
Conciseness: Respond in short, informative sentences.
Formality: Use polite and professional language (e.g., "I would be glad to assist," "Please let me know more details").
Clarity: Avoid unnecessary technical jargon unless requested by the client.
Consistency: Ensure responses reflect professionalism, friendliness, and reliability.
Example: "Thank you for reaching out! I’d be glad to discuss your project and how I can help."


FAQs:
General:
What is your return policy?

You can return items within 30 days with the original receipt and packaging. Refunds are processed to the original payment method.
Do you ship internationally?

Yes, we ship to most countries. Shipping rates and delivery times vary by location.
How can I track my order?

You will receive a tracking number via email once your order is shipped.
Can I cancel or modify my order?

Orders can be modified or canceled within 24 hours. Please contact support@yourbusiness.com.
Madrid Location:
What are your opening hours in Madrid?

Monday to Friday: 10:00 AM to 8:00 PM
Saturday: 10:00 AM to 6:00 PM
Sunday: Closed
Is parking available at the Madrid store?

Yes, we offer parking nearby. Contact us for details.
How can I contact the Madrid store?

You can call us at +34 91 123 4567 or email madrid@yourbusiness.com.
New York Location:
What are your opening hours in New York?

Monday to Friday: 9:00 AM to 7:00 PM
Saturday: 10:00 AM to 5:00 PM
Sunday: Closed
Do you host events at the New York location?

Yes, we host regular workshops and community events. Check our website for updates.
How can I contact the New York store?

You can call us at +1 212-123-4567 or email newyork@yourbusiness.com.

Tone Instructions:
Conciseness: Respond in short, informative sentences.
Formality: Use polite language with slight formality (e.g., "Please let us know," "We are happy to assist").
Clarity: Avoid technical jargon unless necessary.
Consistency: Ensure responses are aligned in tone and style across all queries.
Example: "Thank you for reaching out! Please let us know if you need further assistance."

`;

const API_KEY = "AIzaSyCsR6CdrVfFI97Ynmd4G6ea99TsD-KfKlw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  model: "gemini-1.5-flash",
  systemInstruction: businessInfo,
});

let messages = {
  history: [],
};

async function sendMessage() {
  console.log(messages);
  const userMessage = document.querySelector(".chat-window input").value;

  if (userMessage.length) {
    try {
      document.querySelector(".chat-window input").value = "";
      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `
      );

      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="loader"></div>
            `
      );

      const chat = model.startChat(messages);

      let result = await chat.sendMessageStream(userMessage);

      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="model">
                    <p></p>
                </div>
            `
      );

      let modelMessages = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        modelMessages = document.querySelectorAll(
          ".chat-window .chat div.model"
        );
        modelMessages[modelMessages.length - 1]
          .querySelector("p")
          .insertAdjacentHTML(
            "beforeend",
            `
                ${chunkText}
            `
          );
      }

      messages.history.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      messages.history.push({
        role: "model",
        parts: [
          {
            text: modelMessages[modelMessages.length - 1].querySelector("p")
              .innerHTML,
          },
        ],
      });
    } catch (error) {
      document.querySelector(".chat-window .chat").insertAdjacentHTML(
        "beforeend",
        `
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `
      );
    }

    document.querySelector(".chat-window .chat .loader").remove();
  }
}

document
  .querySelector(".chat-window .input-area button")
  .addEventListener("click", () => sendMessage());

document.querySelector(".chat-button").addEventListener("click", () => {
  document.querySelector("body").classList.add("chat-open");
});

document
  .querySelector(".chat-window button.close")
  .addEventListener("click", () => {
    document.querySelector("body").classList.remove("chat-open");
  });
