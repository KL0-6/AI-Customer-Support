#include "routes/chat/chat.h"
#include <drogon/drogon.h>

#include <fstream>

int main(int argc, char* argv[]) 
{
    if(argc < 2)
    {
        std::printf("Please provide Gemini API key as argument 1!\n");

        return 0;
    }

    ChatCtrl::setApiKey(argv[1]);

    drogon::app().addListener("0.0.0.0", 7770).setThreadNum(0).run();

    return 0;
}
