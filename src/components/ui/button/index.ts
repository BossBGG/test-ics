import { cva, type VariantProps } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        cancelworkorderrequest:
          "bg-[#994C80] text-primary-foreground hover:bg-[#994C80]/90",
        editquotation:
          "bg-[#994C80] text-primary-foreground hover:bg-[#994C80]/90",
        printquotation:
          "bg-[#69306D] text-primary-foreground hover:bg-[#69306D]/90",
        back: "bg-[#69306D] text-primary-foreground hover:bg-[#69306D]/90",
        createworkorder:
          "bg-[#69306D] text-primary-foreground hover:bg-[#69306D]/90",
        uploadMOIform:
          "bg-[#CE9701] text-primary-foreground hover:bg-[#CE9701]/90",
        printMOIform:
          "bg-[#3F51B5] text-primary-foreground hover:bg-[#3F51B5]/90",
        endICS: "bg-[#69306D] text-primary-foreground hover:bg-[#69306D]/90",
        createreferncerequestform:
          "bg-[#65004A] text-primary-foreground hover:bg-[#65004A]/90",
        editworkorderform:
          "bg-[#9A3E7E] text-primary-foreground hover:bg-[#9A3E7E]/90",
        confirm: "bg-[#994C80] text-primary-foreground hover:bg-[#994C80]/90",
        close: "bg-[#D3BCC0] text-primary-foreground hover:bg-[#D3BCC0]/90",
        workclosurenotapproved: "bg-[#E53E3E] text-primary-foreground hover:bg-[#E53E3E]/90",
        workclosureapproved: "bg-[#38A169] text-primary-foreground hover:bg-[#38A169]/90",
        finishedwork: "bg-[#9A3E7E] text-primary-foreground hover:bg-[#9A3E7E]/90",
        re_entertransaction: "bg-[#9A3E7E] text-primary-foreground hover:bg-[#9A3E7E]/90",
        
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
