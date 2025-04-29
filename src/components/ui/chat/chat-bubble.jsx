import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageLoading from "./message-loading";
import { Button } from "../button";

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-2 max-w-[60%] items-end relative group",
  {
    variants: {
      variant: {
        received: "self-start",
        sent: "self-end flex-row-reverse justify-end",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full items-center",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

const ChatBubble = React.forwardRef(({ className, variant, layout, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        "relative group"
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, { variant, layout })
          : child
      )}
    </div>
  );
});
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
const ChatBubbleAvatar = ({ src, fallback, className }) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt="Avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("text-sm p-4", {
  variants: {
    variant: {
      received: "bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg",
      sent: "bg-primary text-primary-foreground text-white rounded-l-lg rounded-tr-lg",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

const ChatBubbleMessage = React.forwardRef(
  ({ className, variant, layout, isLoading = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          chatBubbleMessageVariants({ variant, layout, className }),
          "break-words max-w-full whitespace-pre-wrap"
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <MessageLoading />
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
const ChatBubbleTimestamp = ({ timestamp, className, ...props }) => {
  return (
    <div className={cn("text-xs text-slate-400 mt-2 text-right", className)} {...props}>
      {timestamp}
    </div>
  );
};

// ChatBubbleAction
const ChatBubbleAction = ({
  icon,
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    >
      {icon}
    </Button>
  );
};

const ChatBubbleActionWrapper = React.forwardRef(
  ({ variant, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          variant === "sent"
            ? "-left-1 -translate-x-full flex-row-reverse"
            : "-right-1 translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
};
