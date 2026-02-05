# Navigation Plan and Recommendations

## Analysis of Current Implementation:

### `src/app/conversion/[type].tsx`

- This file correctly implements dynamic routing using Expo Router's file-system based routing and `useLocalSearchParams` to extract the `type` parameter.
- It uses `useRouter` for programmatic navigation (`router.back()`, `router.push()`) to other tab screens.

### `src/app/(tabs)/index.tsx`

- This file utilizes the `Link` component from `expo-router` to navigate to the `conversion/[type]` screen, passing the `type` parameter via the `href` prop (e.g., `href={{ pathname: "/conversion/[type]", params: { type: category.name } }}`). This is a standard and recommended approach for declarative navigation.
- It also uses `router.push()` for navigating to the history tab.

## Answering Your Questions:

### 1. Do I require the `Link` component?

- **No, you are not strictly _required_ to use the `Link` component, but it is currently being used effectively.**
- The `Link` component provides declarative navigation within JSX. While it offers benefits like accessibility and web compatibility, these might be less critical for a purely mobile application. Programmatic navigation with `useRouter().push()` is a strong alternative for mobile, offering more control over the navigation stack.
- **Alternative:** You can achieve the same navigation programmatically using `useRouter().push()` within an `onPress` handler. For example, instead of wrapping the `CategoryCard` with `Link`, you could add an `onPress` to `CategoryCard` that calls `router.push({ pathname: "/conversion/[type]", params: { type: category.name } })`.

### 2. Is there a better way to make the screen `[type].tsx`?

- **The current approach of using `src/app/conversion/[type].tsx` is the standard and recommended way for dynamic screens with Expo Router.** This leverages file-system based routing and dynamic segments, which is considered a best practice for this type of route in Expo Router.
- There isn't a fundamentally "better" architectural way to achieve this dynamic screen within the Expo Router framework. Your current implementation aligns with best practices.

## Recommendations:

If you prefer to use programmatic navigation instead of the `Link` component, here's how you could modify `src/app/(tabs)/index.tsx`:

**Option 1: Modify `CategoryCard` to accept an `onPress` prop and use `router.push()`**

1.  **Modify `CategoryCard` component (if not already done)**: Ensure `CategoryCard` can accept and propagate an `onPress` prop.

2.  **Update `src/app/(tabs)/index.tsx`:**

    ```tsx
    // ... other imports
    import { useRouter } from "expo-router";
    // ...

    export default function HomeScreen() {
      const router = useRouter();
      // ...

      return (
        // ...
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.name}
            title={category.name}
            units={category.units}
            icon={category.icon as any}
            color={category.color}
            onPress={() =>
              router.push({
                pathname: "/conversion/[type]",
                params: { type: category.name },
              })
            }
          />
        ))}
        // ...
      );
    }
    ```

This approach removes the `Link` component wrapper and uses programmatic navigation when a `CategoryCard` is pressed. Both `Link` and `router.push()` are valid ways to navigate, and the choice often comes down to preference or specific interaction requirements.

Would you like me to proceed with a plan to modify the code based on these recommendations, or are you satisfied with the current implementation? Or would you like to discuss further?
