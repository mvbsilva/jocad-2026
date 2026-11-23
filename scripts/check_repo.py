#!/usr/bin/env python3
"""Verificação estática, sem conexão com Supabase nem alterações de dados."""
from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
required=['index.html','assets/css/site.css','assets/js/bootstrap.js','assets/js/portal.js','assets/js/awards.js','assets/js/programacao.js','assets/images/logo_ifpa_braganca.png','assets/images/logo_jocad_2026.jpg','config.example.js']
required += [f'database/migrations/{p.name}' for p in sorted((root/'database/migrations').glob('*.sql'))]
errors=[]
for path in required:
    if not (root/path).is_file():errors.append(f'Ausente: {path}')
for match in re.finditer(r'(?:src|href)=["\']([^"\']+)["\']',html):
    target=match.group(1).split('?',1)[0].split('#',1)[0]
    if not target or target.startswith(('https:','http:','mailto:','#','data:')):continue
    if target=='config.js':continue # fornecido pelo ambiente
    if not (root/target).is_file():errors.append(f'Referência inexistente: {target}')
if len(list((root/'database/migrations').glob('*.sql')))!=9:errors.append('Esperadas 9 migrações SQL.')
if errors:
    print('FALHA\n'+'\n'.join(errors));sys.exit(1)
print('OK: arquivos, referências e nove migrações presentes.')
