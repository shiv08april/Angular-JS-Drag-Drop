import { Injectable } from '@angular/core';
import { ItemNode } from '../models/ItemNode.model';
import { DATA } from '../mockData/data.mock';
import { BehaviorSubject } from 'rxjs';
import { MatTreeModule,MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {CdkDragDrop} from '@angular/cdk/drag-drop';


/**
 * This class transforms a data array into structured tree
 */

@Injectable()
export class TreeBuilder {
    dataChange = new BehaviorSubject<ItemNode[]>([]);

    get data(): ItemNode[] { return this.dataChange.value; }

    constructor() {
        this.initialize();
    }

    initialize() {
        //console.log(DATA);

        // Build the tree nodes from Json object. The result is a list of `ItemNode` with nested
            //     ItemNode node as children.
        const data = this.builTree(DATA, 0,0);
        this.dataChange.next(data);
    }

    builTree(obj: any, level: number,parentId: number): ItemNode[] {
        return Object.keys(obj).reduce<ItemNode[]>((accumulator, key, idx) => {
            const value = obj[key];
            const node = new ItemNode(value.id, value.name);
            /**
                       * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
                       * By passing parentId to buildFileTree, it constructs a path of indexes which make
                       * it possible find the exact sub-array that the node was grabbed from when dropped.
                       */
            node.id=parseInt(''+parentId+level+idx);
            //console.log(value);
            if (value != null) {
                if (typeof value === 'object') {
                    if (value.children !== undefined) {
                        node.children = this.builTree(value.children, level + 1,node.id);
                    }
                }
            }

            return accumulator.concat(node);
        }, []);
    }

}
