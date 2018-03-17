import { substantiveElements } from '../content.js';
import * as symbols from '../symbols.js';
import * as updates from '../updates.js';
import { SlotContent } from './SlotContentMixin.js';


// Symbols for private data members on an element.
const itemsKey = Symbol('items');
const originalKey = Symbol('original');
const previousContentKey = Symbol('previousContent');

export class ContentItems extends SlotContent {

  /**
   * Returns a set of calculations about the given item that can be derived from
   * the component's current state.
   *
   * The goal of the `itemCalcs` step is to ensure that all mixins/classes use
   * a consistent definition for facts about an item that can be derived from
   * component state. By default, `itemCalcs` includes a member `index`
   * containing the index of the indicated item. Other mixins/classes can
   * extend the result of `itemCalcs` to include additional facts.
   *
   * For example, the [SingleSelectionMixin](SingleSelectionMixin) tracks
   * selection at the component level through a state member
   * `state.selectedIndex`. When rendering a specific item, a component
   * generally wants to know, "Is this specific item the one which is
   * selected?". `SingleSelectionMixin` does this with a defintion for
   * `itemCalcs` that looks like this:
   *
   *     itemCalcs(item, index) {
   *       const base = super.itemCalcs ? super.itemCalcs(item, index) : null;
   *       return Object.assign({}, base, {
   *         selected: index === this.state.selectedIndex
   *       });
   *     }
   *
   * This ensures that any other aspect of the component that wants to inspect
   * the selected state of a given item uses a consistent definition for
   * selection.
   *
   * @param {Element} item - the item being considered
   * @param {number} index - the item's position in the list
   */
  itemCalcs(item, index) {
    const base = super.itemCalcs ? super.itemCalcs(item, index) : {};
    return Object.assign({ index }, base);
  }

  /**
   * The current set of items drawn from the element's current state.
   *
   * This function invokes [itemsForState](#itemsForState) to extract the
   * items from the element's `state`.
   *
   * @returns {Element[]|null} the element's current items
   */
  get items() {
    const base = super.items;
    if (base) {
      // Prefer base result if it's defined.
      return base;
    }
    const content = this.content;
    if (this[previousContentKey] !== content) {
      // Memoize
      this[itemsKey] = this.itemsForState();
      // Make immutable.
      Object.freeze(this[itemsKey]);
      this[previousContentKey] = content;
    }
    return this[itemsKey];
  }

  itemsForState() {
    return this.content ?
      substantiveElements(this.content) :
      null;
  }

  /**
   * Determine what updates should be applied to an item to reflect the current state,
   * using the format defined by the [updates](updates) helpers.
   *
   * By default, this returns an empty object. You should override this method
   * (or use mixins that override this method) to indicate what updates should
   * be applied to the given item during rendering.
   *
   * Example: [AriaListMixin](AriaListMixin) uses code similar to the following to
   * have an item's `aria-selected` attribute reflect its selection state:
   *
   *     itemUpdates(item, calcs, original) {
   *       const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
   *       return merge(base, {
   *         attributes: {
   *           'aria-selected': calcs.selected
   *         },
   *       });
   *     }
   *
   * This code fragment is intended for use with
   * [SingleSelectionMixin](SingleSelectionMixin), which provides the
   * `calcs.selected` member.
   *
   * @param {Element} item - the item to be updated
   * @param {object} calcs - per-item calculations derived from element state
   * @param {object} original - the item's original HTML attributes, classes, and style
   * @returns {object} the DOM updates that should be applied to the item
   */
  itemUpdates(item, calcs, original) {
    return super.itemUpdates ?
      super.itemUpdates(item, calcs, original) :
      {};
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    if (this.itemUpdates) {
      const items = this.items || [];
      items.forEach((item, index) => {
        if (item[originalKey] === undefined) {
          item[originalKey] = updates.current(item);
        }
        const calcs = this.itemCalcs(item, index);
        updates.apply(item, this.itemUpdates(item, calcs, item[originalKey]));
      });
    }
  }

}
