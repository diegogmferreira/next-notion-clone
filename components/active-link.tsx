'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IProps {
  href: string;
  children: React.ReactNode
}

export function ActiveLink({children, href}: IProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn("")}>
      {children}
    </Link>
  )
}