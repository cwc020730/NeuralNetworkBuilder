
# Steps for adding a new unit

1. Add the unit information in `src/components/UnitList.json` (dict key must be the same as primary_label)
2. Add the unit object class in `backend/unit_objects`
3. Add the import path to all the relevant `__init__.py` files
4. Import and add the new object in `backend/unit_object_allocator.py` and include a new entries of primary_label to object mapping in `UnitObjectAllocator.UNIT_OBJ_MAP` constant
