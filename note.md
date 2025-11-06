1<!-- recherche avancaee  -->
<!-- perfection de page -->
<!-- list en tableaux  -->
<!-- card bien soigner  -->


1 ------ MIla manenjika anle recherche Globale sy recherche tsotra  aloha voalohany ndrindra 
2 ------ resaka front avieo  mila amboarina tsara be miintsy aloha 
3----- amboarina  le boky sy le 

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Met à jour la valeur déBouncée après le délai.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);