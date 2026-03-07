import { useEffect, useRef, useState } from "react";
import { useDebugStore } from "../../../store/debug_store";
import { ConsoleToolbar } from "./ConsoleToolbar";
import { ConsoleInput } from "./ConsoleInput";
import { Message } from "./Message";
import { Spinner } from "@proton/ui";

export function ConsolePanel() {
  const messages = useDebugStore((state) => state.messages);
  const filterMask = useDebugStore((state) => state.filterMask);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(
    (m) => (filterMask & (1 << m.level)) !== 0,
  );

  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [filteredMessages, autoScroll]);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 4;
    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ConsoleToolbar
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
      />
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={onScroll}
      >
        {filteredMessages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ConsoleInput />
    </div>
  );
}
