import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/components/ui/chat/hooks/useAutoScroll";
import PropTypes from 'prop-types';

const ChatMessageList = React.forwardRef((props, _ref) => {
  const { className, children, smooth = false, ...otherProps } = props;

  const {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom,
    disableAutoScroll,
  } = useAutoScroll({
    smooth,
    content: children,
  });

  return (
    <div className="relative w-full h-full">
      <div
        className={`flex flex-col w-full h-full p-4 overflow-y-auto ${className}`}
        ref={scrollRef}
        onWheel={disableAutoScroll}
        onTouchMove={disableAutoScroll}
        {...otherProps}
      >
        <div className="flex flex-col gap-3">{children}</div>
      </div>

      {!isAtBottom && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="outline"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

ChatMessageList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  smooth: PropTypes.bool,
};

ChatMessageList.defaultProps = {
  smooth: false,
};

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
