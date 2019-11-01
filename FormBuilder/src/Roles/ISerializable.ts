interface ISerializable {
    Serialize(): { [id: string]: string };
    Deserialize(data: { [id: string]: string }): void;
}