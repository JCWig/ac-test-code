function popoverDirective($tooltip) {
  return $tooltip('akamPopover', 'popover', 'click', {
    useContentExp: false,
    popupDelay: 200
  });
}

popoverDirective.$inject = ['$tooltip'];

export default popoverDirective;