# Arrays

## Usage

- `arrayname[index]` accesses the pointer to that index.
- `{arrayname[index]}` access the value at that pointer.
- `${arrayname[index]}` stringifies it.

## Reminder

### Setting an array

Arrays create shorthand for multiple variables
The only issue is length has to be known before compile.
There is no `*set` for adding or removing from an array.

Written as
`*create_array [name], [array_size], [values - if different]`

Example
`*create_array ponies 3 "fluttershy", "applejack", "twilight sparkle"`

Is equivalent to

```txt
*create ponies_1 "fluttershy"
*create ponies_2 "applejack"
*create ponies_3 "twilight sparkle"
```

`*create_array ponies_leg_count 3 4`

Is equivalent to

```txt
*create ponies_leg_count_1 4
*create ponies_leg_count_2 4
*create ponies_leg_count_3 4
```

### Complex objects

You can use multiple arrays for multiple object properties
Tabbing is probably necessary for readability.

```text
*create_array room_name     3 "sitting room" "attic" "library"
*create_array room_shroud   3   0               2       1
*create_array room_clues    3   0               1       4
```

An index variable set to `1` here could access the properties of the sitting room.
