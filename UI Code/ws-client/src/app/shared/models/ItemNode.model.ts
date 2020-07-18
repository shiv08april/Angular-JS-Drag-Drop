export class ItemNode {
    id: number;
    name: string;
    children: ItemNode[];

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
