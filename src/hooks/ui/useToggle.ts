import { useState, useCallback, useMemo } from "react";

interface UseToggleOptions {
  defaultValue?: boolean;
  onToggle?: (value: boolean) => void;
  onChange?: (value: boolean) => void;
}

/**
 * Hook for managing boolean toggle state
 */
export const useToggle = (
  initialValue: boolean = false,
  options: UseToggleOptions = {}
) => {
  const { defaultValue = initialValue, onToggle, onChange } = options;

  const [value, setValue] = useState(defaultValue);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const newValue = !prev;
      onToggle?.(newValue);
      onChange?.(newValue);
      return newValue;
    });
  }, [onToggle, onChange]);

  const setTrue = useCallback(() => {
    setValue(true);
    onToggle?.(true);
    onChange?.(true);
  }, [onToggle, onChange]);

  const setFalse = useCallback(() => {
    setValue(false);
    onToggle?.(false);
    onChange?.(false);
  }, [onToggle, onChange]);

  const reset = useCallback(() => {
    setValue(defaultValue);
    onToggle?.(defaultValue);
    onChange?.(defaultValue);
  }, [defaultValue, onToggle, onChange]);

  return useMemo(
    () => ({
      value,
      toggle,
      setTrue,
      setFalse,
      reset,
      setValue,
    }),
    [value, toggle, setTrue, setFalse, reset]
  );
};

/**
 * Hook for managing multiple toggle states
 */
export const useToggles = <T extends Record<string, boolean>>(
  initialState: T
) => {
  const [toggles, setToggles] = useState(initialState);

  const toggle = useCallback((toggleName: keyof T) => {
    setToggles((prev) => ({
      ...prev,
      [toggleName]: !prev[toggleName],
    }));
  }, []);

  const setToggle = useCallback((toggleName: keyof T, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [toggleName]: value,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setToggles(initialState);
  }, [initialState]);

  return {
    toggles,
    toggle,
    setToggle,
    resetAll,
    setToggles,
  };
};
