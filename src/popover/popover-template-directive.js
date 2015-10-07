function popoverTemplate($tooltip) {
  return $tooltip('akamPopoverTemplate', 'popover', 'click', {
    useContentExp: true,
    popupDelay: 200
  });
}

popoverTemplate.$inject = ['$tooltip'];

export default popoverTemplate;