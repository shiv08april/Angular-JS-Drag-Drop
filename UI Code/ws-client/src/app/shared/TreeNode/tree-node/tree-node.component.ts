import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeModule,MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeBuilder } from '../../utils/TreeBuilder';
import { ItemNode } from '../../models/ItemNode.model';
import { ItemFlatNode } from '../../models/ItemFlatNode.model';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogTableComponent } from '../../dialog-table/dialog-table/dialog-table.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
  providers: [TreeBuilder]
})
export class TreeNodeComponent implements OnInit {

  treeControl: FlatTreeControl<ItemFlatNode>;
  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
    expandedNodeSet = new Set<number>();
dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();
  nodeList: any[];

  constructor(private database: TreeBuilder, private dialog: MatDialog) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    console.log('Tree Flattener ::: ', this.treeFlattener);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this._getLevel, this._isExpandable);
    console.log('Tree Control', this.treeControl);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      console.log('data Source :::: ', this.dataSource.data);
    });
  }
  ngOnInit() {
  }

  transformer = (node: ItemNode, level: number) => {
    return new ItemFlatNode(!!node.children, node.id, node.name, level);
  }

  // tslint:disable-next-line:variable-name
  private _getLevel = (node: ItemFlatNode) => node.level;

  // tslint:disable-next-line:variable-name
  private _isExpandable = (node: ItemFlatNode) => node.expandable;

  // tslint:disable-next-line:variable-name
  private _getChildren = (node: ItemNode): Observable<ItemNode[]> => observableOf(node.children);

  // tslint:disable-next-line:variable-name
  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    // console.log(this.checklistSelection)
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  displayTableNode(node) {
    console.log(this.checklistSelection);
    this.nodeList = [];
    const fileDetails = {
      fileName: 'Test File.docx',
      age: '60 minutes',
      filePath: '/Users/Downloads//Test File.docx',
      modifiedDate: '2020-07-13T16:16:17.57'
    };
    this.nodeList.push(fileDetails);
    this.openAlertDialog(this.nodeList);
  }

  selectNodes(descendants) {
    this.checklistSelection.select(descendants);
    this.openAlertDialog(this.nodeList);
  }

  openAlertDialog(details) {
    const dialogRef = this.dialog.open(DialogTableComponent, {
      data: {
        message: [],
        treeNode: details
      }
    });
  }



/**
   * This constructs an array of nodes that matches the DOM,
   * and calls rememberExpandedTreeNodes to persist expand state
   */
  visibleNodes(): ItemNode[] {
    this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
    const result = [];

    function addExpandedChildren(node: ItemNode, expanded: Set<number>) {
      result.push(node);
      if (expanded.has(node.id) && node.children!=undefined) {
        node.children.map(child => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach(node => {
      addExpandedChildren(node, this.expandedNodeSet);
    });
    return result;
  }
  /**
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   * */
  drop(event: CdkDragDrop<number[]>) {
    // console.log('origin/destination', event.previousIndex, event.currentIndex);

    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) return;

    // construct a list of visible nodes, this will match the DOM.
    // the cdkDragDrop event.currentIndex jives with visible nodes.
    // it calls rememberExpandedTreeNodes to persist expand state
    const visibleNodes = this.visibleNodes();

    // deep clone the data source so we can mutate it
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

    // recursive find function to find siblings of node
    function findNodeSiblings(arr: Array<any>, id: number): Array<any> {
      let result, subResult;
      arr.forEach(item => {
        if (item.id === id) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, id);
          if (subResult) result = subResult;
        }
      });
      return result;
    }

    // remove the node from its old place
    const node = event.item.data;
    const siblings = findNodeSiblings(changedData, node.id);
    const siblingIndex = siblings.findIndex(n => n.id === node.id);
    const nodeToInsert: ItemNode = siblings.splice(siblingIndex, 1)[0];
    const nodeToInsertFlatNode = this.treeControl.dataNodes.find(n => node.id === n.id);
    const previousParent = this.getParentNode(nodeToInsertFlatNode);
    // determine where to insert the node
    const nodeAtDest = visibleNodes[event.currentIndex];
    if (nodeAtDest.id === nodeToInsert.id) return;

    // determine drop index relative to destination array
    let relativeIndex = event.currentIndex; // default if no parent
    const nodeAtDestFlatNode = this.treeControl.dataNodes.find(n => nodeAtDest.id === n.id);
    const currentParent = this.getParentNode(nodeAtDestFlatNode);
    //Don't drop if previous and current node parent is not same
    if (previousParent != currentParent) return;

    if (currentParent) {
      const parentIndex = visibleNodes.findIndex(n => n.id === currentParent.id) + 1;
      relativeIndex = event.currentIndex - parentIndex;
    }
    // insert node
    const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
    if (!newSiblings) return;
    newSiblings.splice(relativeIndex, 0, nodeToInsert);

    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);
  }


  /**
   * Experimental - opening tree nodes as you drag over them
   */
  dragStart() {
    this.dragging = true;
  }
  dragEnd() {
    this.dragging = false;
  }
  dragHover(node: ItemFlatNode) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  dragHoverEnd() {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  rebuildTreeForData(data: any) {
    this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
    this.dataSource.data = data;
    this.forgetMissingExpandedNodes(this.treeControl, this.expandedNodeSet);
    this.expandNodesById(this.treeControl.dataNodes, Array.from(this.expandedNodeSet));
  }

  private rememberExpandedTreeNodes(
    treeControl: FlatTreeControl<ItemFlatNode>,
    expandedNodeSet: Set<number>
  ) {
    if (treeControl.dataNodes) {
      treeControl.dataNodes.forEach((node) => {
        if (treeControl.isExpandable(node) && treeControl.isExpanded(node)) {
          // capture latest expanded state
          expandedNodeSet.add(node.id);
        }
      });
    }
  }

  private forgetMissingExpandedNodes(
    treeControl: FlatTreeControl<ItemFlatNode>,
    expandedNodeSet: Set<number>
  ) {
    if (treeControl.dataNodes) {
      expandedNodeSet.forEach((nodeId) => {
        // maintain expanded node state
        if (!treeControl.dataNodes.find((n) => n.id === nodeId)) {
          // if the tree doesn't have the previous node, remove it from the expanded list
          expandedNodeSet.delete(nodeId);
        }
      });
    }
  }

  private expandNodesById(flatNodes: ItemFlatNode[], ids: number[]) {
    if (!flatNodes || flatNodes.length === 0) return;
    const idSet = new Set(ids);
    return flatNodes.forEach((node) => {
      if (idSet.has(node.id)) {
        this.treeControl.expand(node);
        let parent = this.getParentNode(node);
        while (parent) {
          this.treeControl.expand(parent);
          parent = this.getParentNode(parent);
        }
      }
    });
  }

  private getParentNode(node: ItemFlatNode): ItemFlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


}


