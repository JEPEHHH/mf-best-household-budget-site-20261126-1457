// make.fun's dossier library lives in the kit copy that ships with this
// repository. Re-export it so the hand-in program imports one stable path;
// the dossier bytes are exactly what the library produces.
export { buildDossier } from '../starter/vendor/makefun-frontend.ts';
