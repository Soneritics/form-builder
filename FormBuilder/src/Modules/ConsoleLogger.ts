class ConsoleLogger implements ILogger
{
    Log(message: any): void
    {
        console.log(message);
    }
}