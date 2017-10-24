abstract class AbstractFormElement implements ISerializable
{
    abstract Serialize(): any;
    abstract Deserialize(data: any): void;

    constructor(data?: any)
    {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }
}