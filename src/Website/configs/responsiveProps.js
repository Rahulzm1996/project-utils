const breakpoints = ['768px', '1800px'];

/**
 * Generates a media query for property based on dimensions
 * @param prop Name of CSS attribute
 * @param value Array of values that needs to be set based on breakpoints
 * @param unit CSS unit
 */
export const responsiveProp = (prop, value, unit) => {
  return `
        @media (max-width: ${breakpoints[0]}) {
            ${prop}: ${value[0]}${unit};
        }
        @media (min-width: ${breakpoints[0]}) and (max-width : ${breakpoints[1]}) {
            ${prop}: ${value[1]}${unit};
        }
        @media (min-width: ${breakpoints[1]}) {
            ${prop}: ${value[2]}${unit};
        }
    `;
};
