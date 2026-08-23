# BRIEF — Champ téléphone optionnel dans ContactForm

> Repo path: `docs/briefs/contact_phone_form.md`
> Rédigé 2026-08-23. Étape (d) sur 4. Les étapes (a) DB, (b) RPC et (c) route sont
> **déjà faites, lancées et vérifiées**. Ne pas y toucher.

---

## ⛔ RÈGLES NON NÉGOCIABLES

1. **NE PAS COMMITTER. NE PAS `git add`.** Bassim relit le diff complet lui-même
   et committe. Terminer en listant les fichiers modifiés, rien de plus.
2. **UN SEUL FICHIER MODIFIÉ** : `src/app/components/ContactForm.tsx`.
   Si le travail semble en exiger un autre, S'ARRÊTER et le signaler.
3. **NE RIEN REFACTORISER.** Pas de renommage, pas de réorganisation, pas de
   « pendant qu'on y est ». Le fichier a des conventions ; les suivre, pas les
   améliorer.
4. Apostrophes **COURBES** (’) dans tout texte affiché. Droites uniquement dans
   les valeurs machine.

---

## CONTEXTE — CE QUI EXISTE DÉJÀ EN AVAL

La chaîne est complète SAUF le champ visible. Un visiteur ne peut pas encore saisir
de numéro, mais tout le reste l'accepte :

- **DB** : colonne `contact_messages.phone text NULL` — créée et vérifiée.
- **RPC** : `submit_contact_message(...)` à **8 paramètres**, `p_phone` en dernier
  avec `default null`. Valide la FORME : 6–32 caractères, `^[+0-9][0-9 ().-]*$`.
  Vide → NULL. Refus vérifié par un vrai rejet (`invalid_phone`).
- **Route** (`src/app/api/contact/route.ts`) : `phone` dans le schéma Zod
  (mêmes bornes), transmis en `p_phone: phone || null`, et affiché dans le mail
  de notification.

**Le serveur renvoie déjà `'phone'` dans le tableau `fields` d'une réponse
`invalid_input`.** Le formulaire doit savoir le traduire — sinon le visiteur
reçoit « Vérifie les champs signalés » sans qu'aucun champ ne soit signalé.

---

## LES TROIS SEULES DÉCISIONS (le reste est de la copie du champ email)

### 1. Le caractère facultatif est DANS LE LIBELLÉ, pas dans le style
`copy.phoneLabel` doit contenir « (facultatif) » en toutes lettres. Un astérisque,
une couleur plus claire ou une italique ne sont **pas** lus par un lecteur d'écran :
l'information disparaîtrait exactement pour les personnes qui en ont le plus besoin.

### 2. `validate()` NE VALIDE QUE SI LE CHAMP EST REMPLI
⚠️ **Le piège principal de ce brief.** Les quatre champs existants sont
obligatoires, donc toutes les vérifications de `validate()` sont inconditionnelles.
Copier ce motif tel quel rendrait le téléphone OBLIGATOIRE — l'inverse exact de la
demande — et **`tsc` passerait au vert sans rien dire**.

Un champ vide n'est pas une erreur. Ne valider que si `phone.trim()` est non vide.

### 3. L'indication suit le motif de `message`, PAS celui de `email`
Les deux motifs coexistent déjà dans le fichier :
- `email` : un `<p>` d'erreur rendu **uniquement en cas de faute**.
- `message` : un `<p>` d'indication **toujours visible**, qui devient rouge et
  affiche l'erreur à la place du texte d'aide.

Le téléphone prend le **motif `message`**. Ce qu'un visiteur a besoin de savoir en
priorité, c'est qu'il peut laisser le champ VIDE — donc l'indication doit être là
AVANT toute erreur. C'est la règle « prévenir avant de signaler ».
Donc `aria-describedby` pointe **toujours** vers `contact-phone-hint`
(comme `message`), jamais conditionnellement (comme `email`).

---

## MODIFICATIONS, DANS L'ORDRE DU FICHIER

### (1) Objet `copy` — trois entrées
Placer `phoneLabel` juste après `emailLabel`, et `phoneHint` avec lui.
`errPhone` va avec les autres `err*`.

```ts
  phoneLabel: 'Ton téléphone (facultatif)',
  phoneHint: 'Utile pour un rappel rapide — tu peux laisser vide.',
  errPhone: 'Ce numéro ne semble pas valide (chiffres, espaces, + et - seulement).',
```

### (2) Type `FieldErrors`
Ajouter `'phone'` à l'union. Ordre : après `'email'`.

### (3) État
```ts
  const [phone, setPhone] = useState('')
```
Juste après `email`, avant `subject`.

### (4) `validate()` — la vérification conditionnelle
Après le bloc `email`, avant `subject` :

```ts
    // ★ FACULTATIF : un champ vide n'est PAS une erreur. C'est la seule
    //   vérification conditionnelle du formulaire — ne pas l'aligner sur
    //   les autres, qui portent des champs obligatoires.
    const p = phone.trim()
    if (p.length > 0 && (p.length < 6 || p.length > 32 || !/^[+0-9][0-9 ().-]*$/.test(p))) {
      errs.phone = copy.errPhone
    }
```

Bornes et regex **identiques** à la route et au RPC. Si elles divergent, le
visiteur voit « tout est bon » et le serveur refuse quand même.

### (5) Corps de la requête
Ajouter `phone` à `JSON.stringify({ ... })`. Le placer après `email` pour suivre
l'ordre du reste.

### (6) Traduction des erreurs serveur
Dans la boucle `for (const f of data.fields)` :
```ts
          if (f === 'phone') map.phone = copy.errPhone
```

### (7) Le champ, entre Email et Objet
Calquer la structure du champ email, avec l'indication du motif `message` :

```tsx
      {/* --- Téléphone (facultatif) --- */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-phone" className="text-sm font-medium text-text">
          {copy.phoneLabel}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          maxLength={32}
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={busy}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby="contact-phone-hint"
          className={fieldClass(fieldErrors.phone)}
        />
        {/* ★ Indication TOUJOURS visible (motif du champ message) : ce qu'il faut
            savoir en premier, c'est qu'on peut laisser vide. */}
        <p
          id="contact-phone-hint"
          className={`text-sm ${fieldErrors.phone ? 'text-red-700' : 'text-muted'}`}
        >
          {fieldErrors.phone ?? copy.phoneHint}
        </p>
      </div>
```

Points à ne pas modifier :
- **PAS de `required`** — c'est tout l'objet du champ.
- `type="tel"` + `inputMode="tel"` : sur mobile, ouvre le pavé numérique.
  `type="tel"` ne valide RIEN côté navigateur (contrairement à `type="email"`) —
  c'est voulu, la validation de forme est la nôtre.
- `autoComplete="tel"` : valeur standard, laisse le navigateur pré-remplir.
  ⚠️ Ne PAS chercher à réparer l'autofill de Chrome. C'est un comportement de
  profil navigateur, déjà testé sur d'autres sites, **hors de notre code**.
  Ne pas y passer de temps.
- `maxLength={32}` : même borne que le serveur.

---

## VÉRIFICATION AVANT DE RENDRE LA MAIN

```bash
npx tsc --noEmit          # doit être SILENCIEUX
```

Puis vérifier soi-même, et le RAPPORTER explicitement :

1. `grep -n "phone" src/app/components/ContactForm.tsx` → **7 zones** touchées.
2. La vérification dans `validate()` est bien **conditionnelle** (`p.length > 0`).
3. L'`<input>` n'a **pas** d'attribut `required`.
4. `aria-describedby` est **inconditionnel** (pas de ternaire).
5. La regex du formulaire est **caractère pour caractère** celle de la route.

⚠️ Un `tsc` vert ne prouve RIEN sur les points 2 à 5 : un champ obligatoire par
erreur compile parfaitement. Ces vérifications se font à l'œil, sur le fichier.

**Ne pas committer.** Lister les modifications et s'arrêter.
