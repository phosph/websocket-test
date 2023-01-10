import { useEffect } from 'react';
import { autorun } from 'mobx';

export default function useAutorun(callback, deps = []) {
  useEffect(() => autorun(callback), [...deps]);
}
