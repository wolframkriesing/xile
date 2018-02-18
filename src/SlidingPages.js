import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import SlidingViewport from './SlidingViewport.js';


const Base =
  DirectionSelectionMixin(
  FocusVisibleMixin(
    SlidingViewport
  ));

class SlidingPages extends Base {}


customElements.define('elix-sliding-pages', SlidingPages);
export default SlidingPages;
