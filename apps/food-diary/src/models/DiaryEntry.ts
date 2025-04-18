class DiaryEntry {
    id: number;
    name: string;
    type: string;
    date: string;

    constructor(id: number, title: string, content: string, date: string) {
        this.id = id;
        this.name = title;
        this.type = content;
        this.date = date
    }
}

export default DiaryEntry;