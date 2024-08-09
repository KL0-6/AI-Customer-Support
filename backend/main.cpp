#include <drogon/drogon.h>


int main() 
{
    drogon::app().addListener("0.0.0.0", 7770).setThreadNum(0).run();

    return 0;
}
