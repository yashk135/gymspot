'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

function Tabs({
  defaultValue,
  value: valueProp,
  onValueChange: onValueChangeProp,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: TabsProps) {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');

  const isControlled = valueProp !== undefined;
  const currentValue = isControlled ? valueProp : selectedValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setSelectedValue(newValue);
      }
      onValueChangeProp?.(newValue);
    },
    [isControlled, onValueChangeProp]
  );

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
      }}
    >
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          'group/tabs flex gap-2',
          orientation === 'horizontal' ? 'flex-col' : 'flex-row',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  'inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({
  value,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-slot="tabs-trigger"
      data-state={isActive ? 'active' : 'inactive'}
      onClick={(e) => {
        onValueChange(value);
        onClick?.(e);
      }}
      className={cn(
        'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-background text-foreground shadow-sm dark:bg-input/30 font-bold'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-state={isActive ? 'active' : 'inactive'}
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
