import { ActivateLink } from "@components/ui/common";
import { Fragment } from "react";

const BreadcrumbItem = ({ el, i }) => {
  return (
    <li
      className={`${
        i === 0 ? "pr-4" : "px-4"
      } font-medium text-gray-500 hover:text-gray-900`}
    >
      <ActivateLink href={el.href}>
        <a>{el.value}</a>
      </ActivateLink>
    </li>
  );
};

export default function BreadCrumbs({ items, isAdmin }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {items.map((el, i) => (
          <Fragment key={el.href}>
            {!el.requireAdmin && <BreadcrumbItem el={el} i={i} />}
            {el.requireAdmin && isAdmin && <BreadcrumbItem el={el} i={i} />}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
