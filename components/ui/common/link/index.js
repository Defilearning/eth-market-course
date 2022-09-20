import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function ActivateLink({
  children,
  activateLinkClass,
  ...props
}) {
  const { pathname } = useRouter();

  let className = children.props.className || "";
  if (pathname === props.href) {
    className = `${className} ${
      activateLinkClass ? activateLinkClass : "text-indigo-500"
    }`;
  }

  return <Link {...props}>{React.cloneElement(children, { className })}</Link>;
}
