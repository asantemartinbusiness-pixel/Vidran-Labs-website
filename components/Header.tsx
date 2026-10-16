"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { headerCta, primaryNav } from "@/content/site";
import { isActivePath, normalisePath } from "@/lib/paths";
import type { NavItem } from "@/lib/types";
import { Chevron } from "./icons";
import { Wordmark } from "./Wordmark";

export function Header() {
  const pathname = normalisePath(usePathname() ?? "/");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

  // Close everything on navigation.
  useEffect(closeAll, [pathname, closeAll]);

  // Same-page links don't change the pathname, and the skip link targets <main>,
  // which is inert while the panel is open — close menus on those clicks too.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link && (link.closest(".site-header") || link.classList.contains("skip-link"))) closeAll();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [closeAll]);

  // Desktop dropdowns: Escape returns focus to the trigger; outside click closes.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRefs.current.get(openMenu)?.focus();
        setOpenMenu(null);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  // Mobile panel: lock scroll, Escape closes and restores focus.
  useEffect(() => {
    document.body.classList.toggle("is-locked", mobileOpen);
    // Keep keyboard and screen-reader focus inside the open panel.
    const behind = [document.getElementById("main"), document.querySelector(".site-footer")];
    behind.forEach((el) => el?.toggleAttribute("inert", mobileOpen));
    if (!mobileOpen) return;
    // Anchor the panel under the header wherever it currently sits (e.g. below the review bar).
    const place = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      document.documentElement.style.setProperty("--mobile-nav-top", `${Math.max(0, Math.round(bottom))}px`);
    };
    place();
    window.addEventListener("resize", place);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      document.body.classList.remove("is-locked");
      behind.forEach((el) => el?.removeAttribute("inert"));
    };
  }, [mobileOpen]);

  // Close the panel if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const onChange = () => mq.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onItemBlur = useCallback((e: React.FocusEvent<HTMLLIElement>, label: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu((cur) => (cur === label ? null : cur));
    }
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      <div className="container site-header__inner">
        <Wordmark />

        <nav ref={navRef} className="primary-nav" aria-label="Primary">
          <ul className="primary-nav__list">
            {primaryNav.map((item, i) =>
              item.children ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  open={openMenu === item.label}
                  alignEnd={i >= primaryNav.length - 2}
                  onToggle={() => setOpenMenu((cur) => (cur === item.label ? null : item.label))}
                  onBlur={(e) => onItemBlur(e, item.label)}
                  triggerRef={(el) => {
                    if (el) triggerRefs.current.set(item.label, el);
                  }}
                />
              ) : (
                <li key={item.label} className="primary-nav__item">
                  <Link
                    href={item.href}
                    className="primary-nav__link"
                    aria-current={pathname === normalisePath(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <Link href={headerCta.href} className="btn header-cta">
          {headerCta.label}
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <MenuIcon open={mobileOpen} />
          <span>{mobileOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      <MobileNav open={mobileOpen} pathname={pathname} />
    </header>
  );
}

function DesktopDropdown({
  item,
  pathname,
  open,
  alignEnd,
  onToggle,
  onBlur,
  triggerRef,
}: {
  item: NavItem;
  pathname: string;
  open: boolean;
  alignEnd: boolean;
  onToggle: () => void;
  onBlur: (e: React.FocusEvent<HTMLLIElement>) => void;
  triggerRef: (el: HTMLButtonElement | null) => void;
}) {
  const id = useId();
  const active = item.children!.some((c) => isActivePath(pathname, c.href));
  return (
    <li className="primary-nav__item" onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={`primary-nav__trigger${active ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        {item.label}
        <Chevron />
      </button>
      <ul id={id} className={`dropdown${alignEnd ? " dropdown--end" : ""}`} hidden={!open}>
        {item.children!.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className="dropdown__link"
              aria-current={pathname === normalisePath(child.href) ? "page" : undefined}
            >
              <span className="dropdown__label">{child.label}</span>
              {child.description ? <span className="dropdown__desc">{child.description}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function MobileNav({ open, pathname }: { open: boolean; pathname: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Expand the section containing the current page when the panel opens.
  useEffect(() => {
    if (open) {
      const current = primaryNav.find((i) => i.children?.some((c) => isActivePath(pathname, c.href)));
      setExpanded(current?.label ?? null);
    }
  }, [open, pathname]);

  return (
    <nav id="mobile-nav" className="mobile-nav" aria-label="Primary" hidden={!open}>
      <div className="container">
        <ul className="mobile-nav__list">
          {primaryNav.map((item) => {
            const subId = `mobile-sub-${item.label.toLowerCase()}`;
            const isOpen = expanded === item.label;
            return (
              <li key={item.label} className="mobile-nav__item">
                <div className="mobile-nav__row">
                  <Link
                    href={item.href}
                    className="mobile-nav__link"
                    aria-current={pathname === normalisePath(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      className="mobile-nav__expand"
                      aria-expanded={isOpen}
                      aria-controls={subId}
                      aria-label={`${item.label} pages`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                    >
                      <Chevron />
                    </button>
                  ) : null}
                </div>
                {item.children ? (
                  <ul id={subId} className="mobile-nav__sub" hidden={!isOpen}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="mobile-nav__sublink"
                          aria-current={pathname === normalisePath(child.href) ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <Link href={headerCta.href} className="btn mobile-nav__cta">
          {headerCta.label}
        </Link>
      </div>
    </nav>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="menu-toggle__icon" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      {open ? (
        <path d="M3.5 3.5l11 11M14.5 3.5l-11 11" stroke="currentColor" strokeWidth="1.5" fill="none" />
      ) : (
        <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" fill="none" />
      )}
    </svg>
  );
}
