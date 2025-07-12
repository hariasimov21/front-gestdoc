
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1

    // Capitalize and replace dashes with spaces
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    return { href, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)} {...props}>
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <Link
              href={crumb.href}
              className={cn(
                "hover:text-foreground",
                crumb.isLast
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              aria-current={crumb.isLast ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
