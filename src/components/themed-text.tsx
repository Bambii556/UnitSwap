import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={[
        type === "default" && "text-base leading-6 text-text",
        type === "title" && "text-3xl font-bold leading-8 text-text",
        type === "defaultSemiBold" &&
          "text-base leading-6 font-semibold text-text",
        type === "subtitle" && "text-xl font-bold text-text",
        type === "link" && "text-base leading-[30px] text-active",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...rest}
    />
  );
}
