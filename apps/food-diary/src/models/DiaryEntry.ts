class DiaryEntry {
    id: number;
    title: string;
    content: string;
    createdAt: Date;

    constructor(id: number, title: string, content: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
    }
}

export default DiaryEntry;