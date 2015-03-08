# SimpleSCP
SimpleSCP to SCP translator based on Esprima parser.

My attemp to do SCP programs more readable. Just look:
SCP operator:
```
... (*
  <- searchElStr3;;
  -> rrel_1: rrel_scp_var: rrel_fixed: a;
  -> rrel_2: rrel_scp_var: rrel_assign: b;
  -> rrel_3: rrel_scp_var: rrel_fixed: c;
*);;
```

The same code in SimpleSCP:
```
search([fixed, a], [assign, b], [fixed, c]);
```
