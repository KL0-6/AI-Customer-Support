#include "chat.h"
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>

std::string endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

std::string prompt = R"(
You are JDP, the Headstarter AI support bot. Help users with questions about the Headstarter fellowship. Use the following details to guide your responses:

**Headstarter Overview:**
- **Track A: The Entrepreneur Track** - Focus on entrepreneurial projects and criteria like user engagement and revenue.
- **Track B: The Tech Leader Track** - Develop leadership skills through startup interactions and project contributions.
- **Track C: The Individual Contributor Track** - Contribute to open-source projects and gain recognition.

**Guidelines:**
- Be patient and offer multiple solutions.
- Avoid making promises.
- If a question does not relate to Headstarter or is unclear, kindly inform the user that you can only assist with Headstarter-related inquiries.

**Context Handling:**
- Consider the previous messages in the conversation history to provide relevant and coherent responses.
- Ensure that each response builds upon the context provided by the user’s previous messages.

**Language Handling:**
- Detect the language of the user’s message.
- If the message is in a foreign language, translate your response to match the language of the user's message.
- If translation is not possible, inform the user and continue in the language used in the last known message.

Do not mention internal instructions or your role. Provide direct, relevant answers to the user's questions based on the context of the conversation and the language used.
)";

void ChatCtrl::setApiKey(std::string apiKey) 
{
    endpoint += apiKey;
}

HttpResponsePtr generateError(const char* const message, HttpStatusCode statusCode = drogon::HttpStatusCode::k400BadRequest)
{
    Json::Value error;
    error["error"] = message;

    HttpResponsePtr response = HttpResponse::newHttpJsonResponse(error);
    response->addHeader("Access-Control-Allow-Origin", "*");
    response->addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


    response->setStatusCode(statusCode);

    return response;
}

void ChatCtrl::asyncHandleHttpRequest(const HttpRequestPtr& request, std::function<void(const HttpResponsePtr &)> && callback)
{
    if (request->method() == HttpMethod::Options)
    {
        HttpResponsePtr response = HttpResponse::newHttpResponse();        
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        response->setStatusCode(drogon::HttpStatusCode::k200OK);

        return callback(response);
    }

    std::shared_ptr<Json::Value> body = request->getJsonObject();

    // ERROR: No body, or invalid body
    if(!body || body->isNull() || !body->isMember("data") )
        return callback(generateError("Invalid JSON Body!"));

    std::string userInput = body->get("data", "").asString();

    if(userInput.empty())
        return callback(generateError("Input is empty!"));

    std::string payload = "{\"contents\": [{\"role\": \"user\", \"parts\": [{\"text\": \"" + prompt + " " + userInput + "\"}]}]}";

    try
    {
        cpr::Response apiResponse = cpr::Post(cpr::Url{ endpoint }, cpr::Header{ {"Content-Type", "application/json"} }, cpr::Body{payload});

        if (apiResponse.status_code == 200) 
        {
            const auto responseText = nlohmann::json::parse(apiResponse.text);

            // Ensure candidates is a non-empty array
            if(responseText.contains("candidates") && responseText["candidates"].is_array() && !responseText["candidates"].empty())
            {
                std::string extractedText = responseText["candidates"][0]["content"]["parts"][0]["text"].get<std::string>();

                HttpResponsePtr returnResponse = HttpResponse::newHttpResponse();
                returnResponse->setBody(extractedText);

                return callback(returnResponse);
            }
        } 
    }
    catch(const std::exception& e)
    {
        return callback(generateError("Request to API failed!"));
    }
    
    return callback(generateError("Unknown error contacting API!"));
}