(module
  ;; ── Types ───────────────────────────────────────────
  (type $AnyFn (sub (struct)))
  (type $WasmStr (array (mut i32)))
  (type $ListBase (sub (struct)))
  (type $StringBuilder (sub (struct (field (mut (ref $WasmStr))) (field (mut i32)) (field (mut i32)))))
  (type $FuncType_4 (func (param (ref $AnyFn))))
  (type $ClosureBase_5 (sub $AnyFn (struct (field (ref $FuncType_4)))))
  (type $ClosureType_6 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)))))
  (type $Browser_Elmish_Html`1<i32> (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1<i32>#0 (sub $Browser_Elmish_Html`1<i32> (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1<i32>#1 (sub $Browser_Elmish_Html`1<i32> (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_10 (sub $ListBase (struct (field i32) (field (mut (ref null $ListBase))))))
  (type $ListCons_11 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1<i32>)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Attr`1<i32> (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1<i32>#0 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1<i32>#1 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field i32))))
  (type $Browser_Elmish_Attr`1<i32>#2 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1<i32>#3 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1 (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1#0 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1#1 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field i32))))
  (type $Browser_Elmish_Attr`1#2 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1#3 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Html`1 (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1#0 (sub $Browser_Elmish_Html`1 (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1#1 (sub $Browser_Elmish_Html`1 (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_25 (sub $ListBase (struct (field (ref $Browser_Elmish_Attr`1<i32>)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Program`2 (sub (struct (field i32) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field i32) (field (ref $AnyFn)))))
  (type $FuncType_27 (func (param (ref $AnyFn)) (param (ref $WasmStr))))
  (type $ClosureBase_28 (sub $AnyFn (struct (field (ref $FuncType_27)))))
  (type $ClosureType_29 (sub $ClosureBase_28 (struct (field (ref $FuncType_27)))))
  (type $FuncType_30 (func (param (ref $AnyFn)) (param i32) (result (ref $AnyFn))))
  (type $ClosureBase_31 (sub $AnyFn (struct (field (ref $FuncType_30)))))
  (type $ClosureType_32 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $FuncType_33 (func (param (ref $AnyFn)) (param i32) (param (ref $WasmStr))))
  (type $ClosureBase_34 (sub $AnyFn (struct (field (ref $FuncType_33)))))
  (type $GcArray_35 (array (mut (ref null $AnyFn))))
  (type $ResizeArray_36 (sub (struct (field (mut (ref null $GcArray_35))) (field (mut i32)))))
  (type $FuncType_37 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (param (ref $AnyFn))))
  (type $ClosureBase_38 (sub $AnyFn (struct (field (ref $FuncType_37)))))
  (type $ClosureType_39 (sub $ClosureBase_38 (struct (field (ref $FuncType_37)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $FuncType_40 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result i32)))
  (type $ClosureBase_41 (sub $AnyFn (struct (field (ref $FuncType_40)))))
  (type $ClosureType_42 (sub $ClosureBase_41 (struct (field (ref $FuncType_40)) (field i32))))
  (type $FuncType_43 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result (ref $AnyFn))))
  (type $ClosureBase_44 (sub $AnyFn (struct (field (ref $FuncType_43)))))
  (type $FuncType_45 (func (param (ref $AnyFn)) (param (ref $AnyFn))))
  (type $ClosureBase_46 (sub $AnyFn (struct (field (ref $FuncType_45)))))
  (type $GcArray_47 (array (mut (ref null $WasmStr))))
  (type $Option_48 (sub (struct (field i32))))
  (type $FuncType_49 (func (param (ref $AnyFn)) (param i32) (param i32) (result i32)))
  (type $ClosureBase_50 (sub $AnyFn (struct (field (ref $FuncType_49)))))
  (type $FuncType_51 (func (param (ref $AnyFn)) (param i32) (result i32)))
  (type $ClosureBase_52 (sub $AnyFn (struct (field (ref $FuncType_51)))))
  (type $ClosureType_53 (sub $ClosureBase_41 (struct (field (ref $FuncType_40)) (field (ref $AnyFn)))))
  (type $ClosureType_54 (sub $ClosureBase_38 (struct (field (ref $FuncType_37)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $ClosureType_55 (sub $ClosureBase_41 (struct (field (ref $FuncType_40)) (field i32))))
  (type $ClosureType_56 (sub $ClosureBase_41 (struct (field (ref $FuncType_40)) (field (ref $AnyFn)))))
  (type $FuncType_57 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Attr`1<i32>))))
  (type $ClosureBase_58 (sub $AnyFn (struct (field (ref $FuncType_57)))))
  (type $ClosureType_59 (sub $ClosureBase_58 (struct (field (ref $FuncType_57)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $ClosureType_60 (sub $ClosureBase_58 (struct (field (ref $FuncType_57)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $FuncType_61 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Html`1<i32>))))
  (type $ClosureBase_62 (sub $AnyFn (struct (field (ref $FuncType_61)))))
  (type $ClosureType_63 (sub $ClosureBase_62 (struct (field (ref $FuncType_61)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $ClosureType_64 (sub $ClosureBase_62 (struct (field (ref $FuncType_61)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $Browser_Elmish_Program`2<i32~i32> (sub (struct (field i32) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field i32) (field (ref $AnyFn)))))
  (type $RefCell_66 (sub (struct (field (mut i32)))))
  (type $FuncType_67 (func (param (ref $AnyFn)) (param i32) (result (ref $Browser_Elmish_Html`1<i32>))))
  (type $ClosureBase_68 (sub $AnyFn (struct (field (ref $FuncType_67)))))
  (type $FuncType_69 (func (param (ref $AnyFn)) (param i32)))
  (type $ClosureBase_70 (sub $AnyFn (struct (field (ref $FuncType_69)))))
  (type $ClosureType_71 (sub $ClosureBase_28 (struct (field (ref $FuncType_27)) (field (ref $ResizeArray_36)) (field i32) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_72 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)) (field (ref $ResizeArray_36)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_73 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)))))
  (type $ClosureType_74 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_75 (sub $ClosureBase_70 (struct (field (ref $FuncType_69)))))
  (rec
    (type $Life_Model (sub (struct (field (ref $GcArray_77)) (field i32) (field i32) (field i32))))
    (type $GcArray_77 (array (mut i32)))
  )
  (type $Life_Msg (sub (struct (field i32))))
  (type $Life_Msg#0 (sub $Life_Msg (struct (field i32))))
  (type $Life_Msg#1 (sub $Life_Msg (struct (field i32))))
  (type $Life_Msg#2 (sub $Life_Msg (struct (field i32))))
  (type $Life_Msg#3 (sub $Life_Msg (struct (field i32))))
  (type $Life_Msg#4 (sub $Life_Msg (struct (field i32))))
  (type $Life_Msg#5 (sub $Life_Msg (struct (field i32) (field i32) (field i32))))
  (type $FuncType_85 (func (param (ref $AnyFn)) (result i32)))
  (type $ClosureBase_86 (sub $AnyFn (struct (field (ref $FuncType_85)))))
  (type $ClosureType_87 (sub $ClosureBase_86 (struct (field (ref $FuncType_85)))))
  (type $ListCons_88 (sub $ListBase (struct (field (ref $Browser_Elmish_Attr`1)) (field (mut (ref null $ListBase))))))
  (type $ListCons_89 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Html`1<ref78> (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1<ref78>#0 (sub $Browser_Elmish_Html`1<ref78> (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1<ref78>#1 (sub $Browser_Elmish_Html`1<ref78> (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_93 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1<ref78>)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Attr`1<ref78> (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1<ref78>#0 (sub $Browser_Elmish_Attr`1<ref78> (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1<ref78>#1 (sub $Browser_Elmish_Attr`1<ref78> (struct (field i32) (field (ref $Life_Msg)))))
  (type $Browser_Elmish_Attr`1<ref78>#2 (sub $Browser_Elmish_Attr`1<ref78> (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1<ref78>#3 (sub $Browser_Elmish_Attr`1<ref78> (struct (field i32) (field (ref $AnyFn)))))
  (type $ListCons_99 (sub $ListBase (struct (field (ref $Browser_Elmish_Attr`1<ref78>)) (field (mut (ref null $ListBase))))))
  (type $FuncType_100 (func (param (ref $AnyFn)) (param i32) (result (ref $Life_Msg))))
  (type $ClosureBase_101 (sub $AnyFn (struct (field (ref $FuncType_100)))))
  (type $ClosureType_102 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_103 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_104 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_105 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_106 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_107 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_108 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_109 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_110 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_111 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_112 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_113 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_114 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_115 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_116 (sub $ClosureBase_101 (struct (field (ref $FuncType_100)) (field i32))))
  (type $ClosureType_117 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $Browser_Elmish_Program`2<ref76~ref78> (sub (struct (field (ref $Life_Model)) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field (ref $Life_Msg)) (field (ref $AnyFn)))))
  (type $FuncType_119 (func (param (ref $AnyFn)) (param (ref $Life_Model)) (result (ref $Life_Model))))
  (type $ClosureBase_120 (sub $AnyFn (struct (field (ref $FuncType_119)))))
  (type $ClosureType_121 (sub $ClosureBase_120 (struct (field (ref $FuncType_119)) (field (ref $Life_Msg)))))
  (type $FuncType_122 (func (param (ref $AnyFn)) (param (ref $Life_Msg)) (result (ref $AnyFn))))
  (type $ClosureBase_123 (sub $AnyFn (struct (field (ref $FuncType_122)))))
  (type $ClosureType_124 (sub $ClosureBase_123 (struct (field (ref $FuncType_122)))))
  (type $FuncType_125 (func (param (ref $AnyFn)) (param (ref $Life_Model)) (result (ref $Browser_Elmish_Html`1<ref78>))))
  (type $ClosureBase_126 (sub $AnyFn (struct (field (ref $FuncType_125)))))
  (type $ClosureType_127 (sub $ClosureBase_126 (struct (field (ref $FuncType_125)))))
  (type $FuncType_128 (func (param (ref $AnyFn)) (param (ref $Life_Model))))
  (type $ClosureBase_129 (sub $AnyFn (struct (field (ref $FuncType_128)))))
  (type $ClosureType_130 (sub $ClosureBase_129 (struct (field (ref $FuncType_128)))))
  (type $ClosureType_131 (sub $ClosureBase_120 (struct (field (ref $FuncType_119)) (field (ref $Life_Msg)))))
  (type $ClosureType_132 (sub $ClosureBase_123 (struct (field (ref $FuncType_122)))))
  (type $ClosureType_133 (sub $ClosureBase_126 (struct (field (ref $FuncType_125)))))
  (type $ClosureType_134 (sub $ClosureBase_129 (struct (field (ref $FuncType_128)))))
  (type $RefCell_135 (sub (struct (field (mut (ref $Life_Model))))))
  (type $ClosureType_136 (sub $ClosureBase_38 (struct (field (ref $FuncType_37)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $FuncType_137 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result (ref $Life_Msg))))
  (type $ClosureBase_138 (sub $AnyFn (struct (field (ref $FuncType_137)))))
  (type $ClosureType_139 (sub $ClosureBase_138 (struct (field (ref $FuncType_137)) (field (ref $Life_Msg)))))
  (type $FuncType_140 (func (param (ref $AnyFn)) (param i32) (param i32) (result (ref $Life_Msg))))
  (type $ClosureBase_141 (sub $AnyFn (struct (field (ref $FuncType_140)))))
  (type $ClosureType_142 (sub $ClosureBase_138 (struct (field (ref $FuncType_137)) (field (ref $AnyFn)))))
  (type $FuncType_143 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Attr`1<ref78>))))
  (type $ClosureBase_144 (sub $AnyFn (struct (field (ref $FuncType_143)))))
  (type $ClosureType_145 (sub $ClosureBase_144 (struct (field (ref $FuncType_143)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $FuncType_146 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Html`1<ref78>))))
  (type $ClosureBase_147 (sub $AnyFn (struct (field (ref $FuncType_146)))))
  (type $ClosureType_148 (sub $ClosureBase_147 (struct (field (ref $FuncType_146)) (field (ref $ResizeArray_36)) (field (ref $StringBuilder)))))
  (type $FuncType_149 (func (param (ref $AnyFn)) (param (ref $Life_Msg)) (param (ref $Life_Model)) (result (ref $Life_Model))))
  (type $ClosureBase_150 (sub $AnyFn (struct (field (ref $FuncType_149)))))
  (type $ClosureType_151 (sub $ClosureBase_28 (struct (field (ref $FuncType_27)) (field (ref $ResizeArray_36)) (field i32) (field (ref $RefCell_135)) (field (ref $Browser_Elmish_Program`2<ref76~ref78>)) (field (ref $AnyFn)))))
  (type $ClosureType_152 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)) (field (ref $ResizeArray_36)) (field (ref $RefCell_135)) (field (ref $Browser_Elmish_Program`2<ref76~ref78>)) (field (ref $AnyFn)))))
  (type $ClosureType_153 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_135)) (field (ref $Browser_Elmish_Program`2<ref76~ref78>)))))
  (type $ClosureType_154 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_135)) (field (ref $Browser_Elmish_Program`2<ref76~ref78>)) (field (ref $AnyFn)))))
  ;; ── Imports ────────────────────────────────────────
  (import "browser" "commit" (func $browser_commit (param i32)))
  (import "canvas" "fillRect" (func $canvas_fillRect (param i32) (param i32) (param i32) (param i32) (param i32)))
  (import "timing" "setInterval" (func $timing_setInterval (param i32) (result i32)))
  (import "canvas" "clear" (func $canvas_clear (param i32)))
  (import "browser" "putc" (func $browser_putc (param i32)))
  (import "env" "consolePrint" (func $consolePrint (param (ref $WasmStr))))
  ;; ── Tags (exception handling) ──────────────────────
  (tag $fsharp_exn)
  ;; ── Functions ──────────────────────────────────────
  (func $strConcat (param $a (ref $WasmStr)) (param $b (ref $WasmStr)) (result (ref $WasmStr))
    (local $la i32)
    (local $lb i32)
    (local $res (ref $WasmStr))
    local.get $a
    array.len
    local.set $la
    local.get $b
    array.len
    local.set $lb
    i32.const 0
    local.get $la
    local.get $lb
    i32.add
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $a
    i32.const 0
    local.get $la
    array.copy $WasmStr $WasmStr
    local.get $res
    local.get $la
    local.get $b
    i32.const 0
    local.get $lb
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strIndexOf (param $strIdx_ha (ref $WasmStr)) (param $strIdx_ne (ref $WasmStr)) (result i32)
    (local $w44 i32)
    (local $w45 i32)
    (local $w46 i32)
    (local $w47 i32)
    local.get $strIdx_ha
    array.len
    local.set $w44
    local.get $strIdx_ne
    array.len
    local.set $w45
    block $strIdx_43_outer (result i32)
      local.get $w45
      i32.const 0
      i32.eq
      if
        i32.const 0
        br $strIdx_43_outer
      end
      i32.const 0
      local.set $w46
      block $while_49_exit
        loop $while_49_lp
          local.get $w46
          local.get $w44
          local.get $w45
          i32.sub
          i32.le_s
          if
            block $strIdx_43_match
              i32.const 0
              local.set $w47
              block $while_48_exit
                loop $while_48_lp
                  local.get $w47
                  local.get $w45
                  i32.lt_s
                  if
                    local.get $strIdx_ha
                    local.get $w46
                    local.get $w47
                    i32.add
                    array.get $WasmStr
                    local.get $strIdx_ne
                    local.get $w47
                    array.get $WasmStr
                    i32.ne
                    if
                      br $strIdx_43_match
                    end
                    local.get $w47
                    i32.const 1
                    i32.add
                    local.set $w47
                    br $while_48_lp
                  else
                    br $while_48_exit
                  end
                end
              end
              local.get $w46
              br $strIdx_43_outer
            end
            local.get $w46
            i32.const 1
            i32.add
            local.set $w46
            br $while_49_lp
          else
            br $while_49_exit
          end
        end
      end
      i32.const -1
    end
  )
  (func $strSubstring (param $src (ref $WasmStr)) (param $start i32) (param $len i32) (result (ref $WasmStr))
    (local $res (ref $WasmStr))
    i32.const 0
    local.get $len
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $src
    local.get $start
    local.get $len
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strReplace (param $src (ref $WasmStr)) (param $frm (ref $WasmStr)) (param $repl (ref $WasmStr)) (result (ref $WasmStr))
    (local $lo i32)
    (local $la i32)
    (local $pos i32)
    (local $acc (ref $WasmStr))
    (local $more i32)
    (local $j i32)
    local.get $frm
    array.len
    local.set $lo
    local.get $lo
    i32.const 0
    i32.eq
    if (result (ref $WasmStr))
      local.get $src
    else
      local.get $src
      array.len
      local.set $la
      i32.const 0
      local.set $pos
      i32.const 0
      i32.const 0
      array.new $WasmStr
      local.set $acc
      i32.const 1
      local.set $more
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $more
          i32.const 1
          i32.eq
          if
            local.get $src
            local.get $pos
            local.get $la
            local.get $pos
            i32.sub
            call $strSubstring
            local.get $frm
            call $strIndexOf
            local.set $j
            local.get $j
            i32.const 0
            i32.lt_s
            if
              i32.const 0
              local.set $more
            else
              local.get $acc
              local.get $src
              local.get $pos
              local.get $j
              call $strSubstring
              call $strConcat
              local.get $repl
              call $strConcat
              local.set $acc
              local.get $pos
              local.get $j
              i32.add
              local.get $lo
              i32.add
              local.set $pos
            end
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $acc
      local.get $src
      local.get $pos
      local.get $la
      local.get $pos
      i32.sub
      call $strSubstring
      call $strConcat
    end
  )
  (func $strSplit (param $ssp_src (ref $WasmStr)) (param $ssp_del (ref $WasmStr)) (result (ref $GcArray_47))
    (local $ssp_dl i32)
    (local $ssp_pos i32)
    (local $ssp_cnt i32)
    (local $ssp_j i32)
    (local $ssp_arr (ref $GcArray_47))
    (local $ssp_pos_1 i32)
    (local $ssp_idx i32)
    (local $ssp_j_1 i32)
    local.get $ssp_del
    array.len
    local.set $ssp_dl
    local.get $ssp_dl
    i32.const 0
    i32.eq
    if (result (ref $GcArray_47))
      local.get $ssp_src
      array.new_fixed $GcArray_47 1
    else
      i32.const 0
      local.set $ssp_pos
      i32.const 1
      local.set $ssp_cnt
      block $ssp_cnt_done
        loop $ssp_cnt_loop
          local.get $ssp_src
          local.get $ssp_pos
          local.get $ssp_src
          array.len
          local.get $ssp_pos
          i32.sub
          call $strSubstring
          local.get $ssp_del
          call $strIndexOf
          local.set $ssp_j
          local.get $ssp_j
          i32.const 0
          i32.lt_s
          if
            br $ssp_cnt_done
          else
            local.get $ssp_cnt
            i32.const 1
            i32.add
            local.set $ssp_cnt
            local.get $ssp_pos
            local.get $ssp_j
            local.get $ssp_dl
            i32.add
            i32.add
            local.set $ssp_pos
            br $ssp_cnt_loop
          end
        end
      end
      array.new_fixed $WasmStr 0
      local.get $ssp_cnt
      array.new $GcArray_47
      local.set $ssp_arr
      i32.const 0
      local.set $ssp_pos_1
      i32.const 0
      local.set $ssp_idx
      block $ssp_fill_done
        loop $ssp_fill_loop
          local.get $ssp_src
          local.get $ssp_pos_1
          local.get $ssp_src
          array.len
          local.get $ssp_pos_1
          i32.sub
          call $strSubstring
          local.get $ssp_del
          call $strIndexOf
          local.set $ssp_j_1
          local.get $ssp_j_1
          i32.const 0
          i32.lt_s
          if
            br $ssp_fill_done
          else
            local.get $ssp_arr
            local.get $ssp_idx
            local.get $ssp_src
            local.get $ssp_pos_1
            local.get $ssp_j_1
            call $strSubstring
            array.set $GcArray_47
            local.get $ssp_idx
            i32.const 1
            i32.add
            local.set $ssp_idx
            local.get $ssp_pos_1
            local.get $ssp_j_1
            local.get $ssp_dl
            i32.add
            i32.add
            local.set $ssp_pos_1
            br $ssp_fill_loop
          end
        end
      end
      local.get $ssp_arr
      local.get $ssp_idx
      local.get $ssp_src
      local.get $ssp_pos_1
      local.get $ssp_src
      array.len
      local.get $ssp_pos_1
      i32.sub
      call $strSubstring
      array.set $GcArray_47
      local.get $ssp_arr
    end
  )
  (func $intToStr (param $n i32) (result (ref $WasmStr))
    (local $s (ref $WasmStr))
    (local $neg i32)
    (local $v i32)
    (local $buf (ref $WasmStr))
    (local $len i32)
    (local $res (ref $WasmStr))
    (local $i i32)
    (local $r2 (ref $WasmStr))
    local.get $n
    i32.const 0
    i32.eq
    if (result (ref $WasmStr))
      i32.const 48
      i32.const 1
      array.new $WasmStr
    else
      local.get $n
      i32.const -2147483648
      i32.eq
      if (result (ref $WasmStr))
        i32.const 0
        i32.const 11
        array.new $WasmStr
        local.set $s
        local.get $s
        i32.const 0
        i32.const 45
        array.set $WasmStr
        local.get $s
        i32.const 1
        i32.const 50
        array.set $WasmStr
        local.get $s
        i32.const 2
        i32.const 49
        array.set $WasmStr
        local.get $s
        i32.const 3
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 4
        i32.const 55
        array.set $WasmStr
        local.get $s
        i32.const 5
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 6
        i32.const 56
        array.set $WasmStr
        local.get $s
        i32.const 7
        i32.const 51
        array.set $WasmStr
        local.get $s
        i32.const 8
        i32.const 54
        array.set $WasmStr
        local.get $s
        i32.const 9
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 10
        i32.const 56
        array.set $WasmStr
        local.get $s
      else
        i32.const 0
        local.set $neg
        local.get $n
        local.set $v
        local.get $n
        i32.const 0
        i32.lt_s
        if
          i32.const 1
          local.set $neg
          i32.const 0
          local.get $n
          i32.sub
          local.set $v
        end
        i32.const 0
        i32.const 12
        array.new $WasmStr
        local.set $buf
        i32.const 0
        local.set $len
        block $q_wl_1_exit
          loop $q_wl_1
            local.get $v
            i32.const 0
            i32.ne
            if
              local.get $buf
              local.get $len
              local.get $v
              i32.const 10
              i32.rem_s
              i32.const 48
              i32.add
              array.set $WasmStr
              local.get $v
              i32.const 10
              i32.div_s
              local.set $v
              local.get $len
              i32.const 1
              i32.add
              local.set $len
              br $q_wl_1
            else
              br $q_wl_1_exit
            end
          end
        end
        i32.const 0
        local.get $len
        array.new $WasmStr
        local.set $res
        i32.const 0
        local.set $i
        block $q_fl_2_exit
          loop $q_fl_2
            local.get $i
            local.get $len
            i32.const 1
            i32.sub
            i32.le_s
            if
              local.get $res
              local.get $i
              local.get $buf
              local.get $len
              local.get $i
              i32.sub
              i32.const 1
              i32.sub
              array.get $WasmStr
              array.set $WasmStr
              local.get $i
              i32.const 1
              i32.add
              local.set $i
              br $q_fl_2
            else
              br $q_fl_2_exit
            end
          end
        end
        local.get $neg
        i32.const 0
        i32.ne
        if (result (ref $WasmStr))
          i32.const 0
          local.get $len
          i32.const 1
          i32.add
          array.new $WasmStr
          local.set $r2
          local.get $r2
          i32.const 0
          i32.const 45
          array.set $WasmStr
          local.get $r2
          i32.const 1
          local.get $res
          i32.const 0
          local.get $len
          array.copy $WasmStr $WasmStr
          local.get $r2
        else
          local.get $res
        end
      end
    end
  )
  (func $parseInt (param $s (ref $WasmStr)) (result i32)
    (local $len i32)
    (local $i i32)
    (local $neg i32)
    (local $acc i32)
    (local $valid i32)
    (local $ch i32)
    local.get $s
    array.len
    local.set $len
    local.get $len
    i32.const 0
    i32.eq
    if (result i32)
      i32.const 0
    else
      i32.const 0
      local.set $i
      i32.const 0
      local.set $neg
      i32.const 0
      local.set $acc
      i32.const 1
      local.set $valid
      local.get $s
      i32.const 0
      array.get $WasmStr
      i32.const 45
      i32.eq
      if
        i32.const 1
        local.set $neg
        i32.const 1
        local.set $i
      end
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $valid
          i32.const 1
          i32.eq
          if (result i32)
            local.get $i
            local.get $len
            i32.lt_s
          else
            i32.const 0
          end
          if
            local.get $s
            local.get $i
            array.get $WasmStr
            local.set $ch
            local.get $ch
            i32.const 48
            i32.lt_s
            if (result i32)
              i32.const 1
            else
              local.get $ch
              i32.const 57
              i32.gt_s
            end
            if
              i32.const 0
              local.set $valid
            else
              local.get $acc
              i32.const 10
              i32.mul
              local.get $ch
              i32.add
              i32.const 48
              i32.sub
              local.set $acc
              local.get $i
              i32.const 1
              i32.add
              local.set $i
            end
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $valid
      i32.const 0
      i32.eq
      if (result i32)
        i32.const 0
      else
        local.get $neg
        i32.const 0
        i32.ne
        if (result i32)
          i32.const 0
          local.get $acc
          i32.sub
        else
          local.get $acc
        end
      end
    end
  )
  (func $sbCreate (param $cap i32) (result (ref $StringBuilder))
    i32.const 0
    local.get $cap
    array.new $WasmStr
    i32.const 0
    local.get $cap
    struct.new $StringBuilder
  )
  (func $sbAppend (param $sb (ref $StringBuilder)) (param $s (ref $WasmStr)) (result (ref $StringBuilder))
    (local $oldLen i32)
    (local $sLen i32)
    (local $newLen i32)
    (local $cap i32)
    (local $doubleCap i32)
    (local $newCap i32)
    (local $newBuf (ref $WasmStr))
    local.get $sb
    struct.get $StringBuilder 1
    local.set $oldLen
    local.get $s
    array.len
    local.set $sLen
    local.get $oldLen
    local.get $sLen
    i32.add
    local.set $newLen
    local.get $sb
    struct.get $StringBuilder 2
    local.set $cap
    local.get $newLen
    local.get $cap
    i32.gt_s
    if
      local.get $cap
      i32.const 1
      i32.shl
      local.set $doubleCap
      local.get $doubleCap
      local.get $newLen
      i32.gt_s
      if (result i32)
        local.get $doubleCap
      else
        local.get $newLen
      end
      local.set $newCap
      i32.const 0
      local.get $newCap
      array.new $WasmStr
      local.set $newBuf
      local.get $newBuf
      i32.const 0
      local.get $sb
      struct.get $StringBuilder 0
      i32.const 0
      local.get $oldLen
      array.copy $WasmStr $WasmStr
      local.get $sb
      local.get $newBuf
      struct.set $StringBuilder 0
      local.get $sb
      local.get $newCap
      struct.set $StringBuilder 2
    end
    local.get $sb
    struct.get $StringBuilder 0
    local.get $oldLen
    local.get $s
    i32.const 0
    local.get $sLen
    array.copy $WasmStr $WasmStr
    local.get $sb
    local.get $newLen
    struct.set $StringBuilder 1
    local.get $sb
  )
  (func $sbToString (param $sb (ref $StringBuilder)) (result (ref $WasmStr))
    (local $len i32)
    (local $res (ref $WasmStr))
    local.get $sb
    struct.get $StringBuilder 1
    local.set $len
    i32.const 0
    local.get $len
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $sb
    struct.get $StringBuilder 0
    i32.const 0
    local.get $len
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $closure_1 (param $self (ref $AnyFn))
  )
  (func $tickSlot$init (result (ref $AnyFn))
    ref.func $closure_1
    struct.new $ClosureType_6
  )
  (func $tick ;; exported as "tick"
    (local $lo_clo_1 (ref $ClosureBase_5))
    global.get $tickSlot
    ref.cast (ref $AnyFn)
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_1
    local.get $lo_clo_1
    local.get $lo_clo_1
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $every (param $ms i32) (param $f (ref $AnyFn)) (result i32) ;; exported as "every"
    local.get $f
    global.set $tickSlot
    local.get $ms
    return_call $timing_setInterval
  )
  (func $send (param $target i32) (param $s (ref $WasmStr)) ;; exported as "send"
    (local $i i32)
    (local $limit i32)
    i32.const 0
    local.set $i
    local.get $s
    array.len
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $i
      local.get $limit
      i32.le_s
      if
        local.get $s
        local.get $i
        array.get $WasmStr
        i32.const -1
        i32.xor
        i32.const -1
        i32.xor
        call $browser_putc
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $for
      end
    end
    local.get $target
    call $browser_commit
  )
  (func $inbox$init (result (ref $WasmStr))
    array.new_fixed $WasmStr 0
  )
  (func $inboxClear ;; exported as "inboxClear"
    array.new_fixed $WasmStr 0
    global.set $inbox
  )
  (func $inboxPut (param $c i32) ;; exported as "inboxPut"
    global.get $inbox
    ref.cast (ref $WasmStr)
    local.get $c
    i32.const 65535
    i32.and
    array.new_fixed $WasmStr 1
    call $strConcat
    global.set $inbox
  )
  (func $inboxText (result (ref $WasmStr)) ;; exported as "inboxText"
    global.get $inbox
    ref.cast (ref $WasmStr)
  )
  (func $escape (param $s (ref $WasmStr)) (result (ref $WasmStr)) ;; exported as "escape"
    local.get $s
    i32.const 38
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 97
    i32.const 109
    i32.const 112
    i32.const 59
    array.new_fixed $WasmStr 5
    call $strReplace
    i32.const 60
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 108
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 4
    call $strReplace
    i32.const 62
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 103
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 4
    call $strReplace
    i32.const 34
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 113
    i32.const 117
    i32.const 111
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 6
    call $strReplace
  )
  (func $closure_3 (param $self (ref $AnyFn)) (param $_arg_1 (ref $WasmStr))
  )
  (func $closure_2 (param $self (ref $AnyFn)) (param $_arg i32) (result (ref $AnyFn))
    ref.func $closure_3
    struct.new $ClosureType_29
  )
  (func $handlerSlot$init (result (ref $AnyFn))
    ref.func $closure_2
    struct.new $ClosureType_32
  )
  (func $dispatch (param $id i32) ;; exported as "dispatch"
    (local $ap_clo_4 (ref $AnyFn))
    (local $ap_arg_4_1 (ref $WasmStr))
    (local $lo_clo_2 (ref $ClosureBase_34))
    (local $lo_clo_4 (ref $ClosureBase_28))
    (local $lo_clo_3 (ref $ClosureBase_31))
    global.get $handlerSlot
    ref.cast (ref $AnyFn)
    local.set $ap_clo_4
    call $inboxText
    local.set $ap_arg_4_1
    local.get $ap_clo_4
    ref.test (ref $ClosureBase_34)
    if
      local.get $ap_clo_4
      ref.cast (ref $ClosureBase_34)
      local.set $lo_clo_2
      local.get $lo_clo_2
      local.get $id
      local.get $ap_arg_4_1
      local.get $lo_clo_2
      struct.get $ClosureBase_34 0
      call_ref $FuncType_33
    else
      local.get $ap_clo_4
      ref.cast (ref $ClosureBase_31)
      local.set $lo_clo_3
      local.get $lo_clo_3
      local.get $id
      local.get $lo_clo_3
      struct.get $ClosureBase_31 0
      call_ref $FuncType_30
      ref.cast (ref $ClosureBase_28)
      local.set $lo_clo_4
      local.get $lo_clo_4
      local.get $ap_arg_4_1
      local.get $lo_clo_4
      struct.get $ClosureBase_28 0
      call_ref $FuncType_27
    end
  )
  (func $cols (result i32) ;; exported as "cols"
    i32.const 80
  )
  (func $rows (result i32) ;; exported as "rows"
    i32.const 50
  )
  (func $cell (result i32) ;; exported as "cell"
    i32.const 8
  )
  (func $next (param $seed i32) (result i32) ;; exported as "next"
    local.get $seed
    i32.const 1103515245
    i32.mul
    i32.const 12345
    i32.add
    i32.const 2147483647
    i32.and
  )
  (func $random (param $seed i32) (result (ref $Life_Model)) ;; exported as "random"
    (local $cells (ref $GcArray_77))
    (local $s i32)
    (local $i i32)
    (local $limit i32)
    i32.const 0
    call $cols
    call $rows
    i32.mul
    array.new $GcArray_77
    local.set $cells
    local.get $seed
    local.set $s
    i32.const 0
    local.set $i
    local.get $cells
    array.len
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $i
      local.get $limit
      i32.le_s
      if
        local.get $s
        call $next
        local.set $s
        local.get $cells
        local.get $i
        local.get $s
        i32.const 16
        i32.shr_s
        i32.const 4
        i32.rem_s
        i32.const 0
        i32.eq
        if (result i32)
          i32.const 1
        else
          i32.const 0
        end
        array.set $GcArray_77
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $for
      end
    end
    local.get $cells
    i32.const 1
    i32.const 0
    local.get $s
    struct.new $Life_Model
  )
  (func $neighbours (param $cells (ref $GcArray_77)) (param $x i32) (param $y i32) (result i32) ;; exported as "neighbours"
    (local $n i32)
    (local $dy i32)
    (local $dx i32)
    i32.const 0
    local.set $n
    i32.const -1
    local.set $dy
    loop $for
      local.get $dy
      i32.const 1
      i32.le_s
      if
        i32.const -1
        local.set $dx
        loop $for
          local.get $dx
          i32.const 1
          i32.le_s
          if
            local.get $dx
            i32.const 0
            i32.ne
            if (result i32)
              i32.const 1
            else
              local.get $dy
              i32.const 0
              i32.ne
            end
            if
              local.get $n
              local.get $cells
              local.get $y
              local.get $dy
              i32.add
              call $rows
              i32.add
              call $rows
              i32.rem_s
              call $cols
              i32.mul
              local.get $x
              local.get $dx
              i32.add
              call $cols
              i32.add
              call $cols
              i32.rem_s
              i32.add
              array.get $GcArray_77
              i32.add
              local.set $n
            end
            local.get $dx
            i32.const 1
            i32.add
            local.set $dx
            br $for
          end
        end
        local.get $dy
        i32.const 1
        i32.add
        local.set $dy
        br $for
      end
    end
    local.get $n
  )
  (func $step (param $m (ref $Life_Model)) (result (ref $Life_Model)) ;; exported as "step"
    (local $cells (ref $GcArray_77))
    (local $y i32)
    (local $limit i32)
    (local $x i32)
    (local $limit_1 i32)
    (local $n i32)
    (local $alive i32)
    (local $Generation i32)
    i32.const 0
    call $cols
    call $rows
    i32.mul
    array.new $GcArray_77
    local.set $cells
    i32.const 0
    local.set $y
    call $rows
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $y
      local.get $limit
      i32.le_s
      if
        i32.const 0
        local.set $x
        call $cols
        i32.const 1
        i32.sub
        local.set $limit_1
        loop $for
          local.get $x
          local.get $limit_1
          i32.le_s
          if
            local.get $m
            struct.get $Life_Model 0
            local.get $x
            local.get $y
            call $neighbours
            local.set $n
            local.get $m
            struct.get $Life_Model 0
            local.get $y
            call $cols
            i32.mul
            local.get $x
            i32.add
            array.get $GcArray_77
            i32.const 1
            i32.eq
            local.set $alive
            local.get $cells
            local.get $y
            call $cols
            i32.mul
            local.get $x
            i32.add
            local.get $n
            i32.const 3
            i32.eq
            if (result i32)
              i32.const 1
            else
              local.get $alive
              if (result i32)
                local.get $n
                i32.const 2
                i32.eq
              else
                i32.const 0
              end
            end
            if (result i32)
              i32.const 1
            else
              i32.const 0
            end
            array.set $GcArray_77
            local.get $x
            i32.const 1
            i32.add
            local.set $x
            br $for
          end
        end
        local.get $y
        i32.const 1
        i32.add
        local.set $y
        br $for
      end
    end
    local.get $m
    struct.get $Life_Model 2
    i32.const 1
    i32.add
    local.set $Generation
    local.get $cells
    local.get $m
    struct.get $Life_Model 1
    local.get $Generation
    local.get $m
    struct.get $Life_Model 3
    struct.new $Life_Model
  )
  (func $update (param $msg (ref $Life_Msg)) (param $m (ref $Life_Model)) (result (ref $Life_Model)) ;; exported as "update"
    (local $Running i32)
    (local $py i32)
    (local $px i32)
    (local $i i32)
    (local $cells (ref $GcArray_77))
    (local $w24 (ref $GcArray_77))
    (local $w25 (ref $GcArray_77))
    local.get $msg
    struct.get $Life_Msg 0
    i32.const 1
    i32.eq
    if (result (ref $Life_Model))
      local.get $m
      struct.get $Life_Model 1
      i32.eqz
      local.set $Running
      local.get $m
      struct.get $Life_Model 0
      local.get $Running
      local.get $m
      struct.get $Life_Model 2
      local.get $m
      struct.get $Life_Model 3
      struct.new $Life_Model
    else
      local.get $msg
      struct.get $Life_Msg 0
      i32.const 2
      i32.eq
      if (result (ref $Life_Model))
        local.get $m
        return_call $step
      else
        local.get $msg
        struct.get $Life_Msg 0
        i32.const 3
        i32.eq
        if (result (ref $Life_Model))
          local.get $m
          struct.get $Life_Model 3
          return_call $random
        else
          local.get $msg
          struct.get $Life_Msg 0
          i32.const 4
          i32.eq
          if (result (ref $Life_Model))
            i32.const 0
            call $cols
            call $rows
            i32.mul
            array.new $GcArray_77
            i32.const 0
            i32.const 0
            local.get $m
            struct.get $Life_Model 3
            struct.new $Life_Model
          else
            local.get $msg
            struct.get $Life_Msg 0
            i32.const 5
            i32.eq
            if (result (ref $Life_Model))
              local.get $msg
              ref.cast (ref $Life_Msg#5)
              struct.get $Life_Msg#5 2
              local.set $py
              local.get $msg
              ref.cast (ref $Life_Msg#5)
              struct.get $Life_Msg#5 1
              local.set $px
              local.get $py
              call $cell
              i32.div_s
              i32.const -1
              i32.xor
              i32.const -1
              i32.xor
              call $cols
              i32.mul
              local.get $px
              call $cell
              i32.div_s
              i32.const -1
              i32.xor
              i32.const -1
              i32.xor
              i32.add
              local.set $i
              local.get $i
              i32.const 0
              i32.ge_s
              if (result i32)
                local.get $i
                local.get $m
                struct.get $Life_Model 0
                array.len
                i32.lt_s
              else
                i32.const 0
              end
              if (result (ref $Life_Model))
                local.get $m
                struct.get $Life_Model 0
                local.set $w24
                i32.const 0
                local.get $w24
                array.len
                array.new $GcArray_77
                local.set $w25
                local.get $w25
                i32.const 0
                local.get $w24
                i32.const 0
                local.get $w24
                array.len
                array.copy $GcArray_77 $GcArray_77
                local.get $w25
                local.set $cells
                local.get $cells
                local.get $i
                i32.const 1
                local.get $cells
                local.get $i
                array.get $GcArray_77
                i32.sub
                array.set $GcArray_77
                local.get $cells
                local.get $m
                struct.get $Life_Model 1
                local.get $m
                struct.get $Life_Model 2
                local.get $m
                struct.get $Life_Model 3
                struct.new $Life_Model
              else
                local.get $m
              end
            else
              local.get $m
              struct.get $Life_Model 1
              if (result (ref $Life_Model))
                local.get $m
                return_call $step
              else
                local.get $m
              end
            end
          end
        end
      end
    end
  )
  (func $text_ref78 (param $s (ref $WasmStr)) (result (ref $Browser_Elmish_Html`1))
    i32.const 0
    local.get $s
    struct.new $Browser_Elmish_Html`1<ref78>#0
  )
  (func $el_ref78 (param $tag (ref $WasmStr)) (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 1
    local.get $tag
    local.get $attrs
    local.get $children
    struct.new $Browser_Elmish_Html`1<ref78>#1
  )
  (func $h2_ref78 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 104
    i32.const 50
    array.new_fixed $WasmStr 2
    local.get $attrs
    local.get $children
    call $el_ref78
  )
  (func $attr_ref78 (param $name (ref $WasmStr)) (param $value (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1))
    i32.const 0
    local.get $name
    local.get $value
    struct.new $Browser_Elmish_Attr`1<ref78>#0
  )
  (func $onPointer_ref78 (param $f (ref $AnyFn)) (result (ref $Browser_Elmish_Attr`1<ref78>))
    i32.const 3
    local.get $f
    struct.new $Browser_Elmish_Attr`1<ref78>#3
  )
  (func $canvas_ref78 (param $attrs (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 99
    i32.const 97
    i32.const 110
    i32.const 118
    i32.const 97
    i32.const 115
    array.new_fixed $WasmStr 6
    local.get $attrs
    ref.null $ListBase
    call $el_ref78
  )
  (func $class$0027_ref78 (param $name (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1<ref78>))
    i32.const 0
    i32.const 99
    i32.const 108
    i32.const 97
    i32.const 115
    i32.const 115
    array.new_fixed $WasmStr 5
    local.get $name
    struct.new $Browser_Elmish_Attr`1<ref78>#0
  )
  (func $onClick_ref78 (param $msg (ref $Life_Msg)) (result (ref $Browser_Elmish_Attr`1<ref78>))
    i32.const 1
    local.get $msg
    struct.new $Browser_Elmish_Attr`1<ref78>#1
  )
  (func $button_ref78 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 98
    i32.const 117
    i32.const 116
    i32.const 116
    i32.const 111
    i32.const 110
    array.new_fixed $WasmStr 6
    local.get $attrs
    local.get $children
    call $el_ref78
  )
  (func $div_ref78 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 100
    i32.const 105
    i32.const 118
    array.new_fixed $WasmStr 3
    local.get $attrs
    local.get $children
    call $el_ref78
  )
  (func $small_ref78 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 115
    i32.const 109
    i32.const 97
    i32.const 108
    i32.const 108
    array.new_fixed $WasmStr 5
    local.get $attrs
    local.get $children
    call $el_ref78
  )
  (func $closure_47 (param $self (ref $AnyFn)) (param $y_1 i32) (result (ref $Life_Msg))
    (local $self_cast (ref $ClosureType_116))
    (local $x_1 i32)
    local.get $self
    ref.cast (ref $ClosureType_116)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_116 1
    local.set $x_1
    i32.const 5
    local.get $x_1
    local.get $y_1
    struct.new $Life_Msg#5
  )
  (func $closure_46 (param $self (ref $AnyFn)) (param $x_1 i32) (result (ref $AnyFn))
    ref.func $closure_47
    local.get $x_1
    struct.new $ClosureType_116
  )
  (func $article_ref78 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref78>))
    i32.const 97
    i32.const 114
    i32.const 116
    i32.const 105
    i32.const 99
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 7
    local.get $attrs
    local.get $children
    call $el_ref78
  )
  (func $view (param $m (ref $Life_Model)) (result (ref $Browser_Elmish_Html`1<ref78>)) ;; exported as "view"
    (local $array (ref $GcArray_77))
    (local $alive i32)
    (local $w28 i32)
    (local $w29 i32)
    (local $w30 i32)
    (local $ca_y i32)
    (local $ca_r i32)
    local.get $m
    struct.get $Life_Model 0
    local.set $array
    local.get $array
    array.len
    local.set $w28
    i32.const 0
    local.set $w29
    i32.const 0
    local.set $w30
    block $while_31_exit
      loop $while_31_lp
        local.get $w30
        local.get $w28
        i32.lt_s
        if
          local.get $array
          local.get $w30
          array.get $GcArray_77
          local.set $ca_y
          local.get $w29
          local.get $ca_y
          i32.add
          local.set $ca_r
          local.get $w29
          local.get $ca_r
          i32.xor
          local.get $ca_y
          local.get $ca_r
          i32.xor
          i32.and
          i32.const 0
          i32.lt_s
          if (result i32)
            throw $fsharp_exn
          else
            local.get $ca_r
          end
          local.set $w29
          local.get $w30
          i32.const 1
          i32.add
          local.set $w30
          br $while_31_lp
        else
          br $while_31_exit
        end
      end
    end
    local.get $w29
    local.set $alive
    ref.null $ListBase
    ref.null $ListBase
    i32.const 71
    i32.const 97
    i32.const 109
    i32.const 101
    i32.const 32
    i32.const 111
    i32.const 102
    i32.const 32
    i32.const 76
    i32.const 105
    i32.const 102
    i32.const 101
    array.new_fixed $WasmStr 12
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $h2_ref78
    i32.const 119
    i32.const 105
    i32.const 100
    i32.const 116
    i32.const 104
    array.new_fixed $WasmStr 5
    call $cols
    call $cell
    i32.mul
    call $intToStr
    call $attr_ref78
    i32.const 104
    i32.const 101
    i32.const 105
    i32.const 103
    i32.const 104
    i32.const 116
    array.new_fixed $WasmStr 6
    call $rows
    call $cell
    i32.mul
    call $intToStr
    call $attr_ref78
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    i32.const 119
    i32.const 105
    i32.const 100
    i32.const 116
    i32.const 104
    i32.const 58
    i32.const 49
    i32.const 48
    i32.const 48
    i32.const 37
    i32.const 59
    i32.const 98
    i32.const 97
    i32.const 99
    i32.const 107
    i32.const 103
    i32.const 114
    i32.const 111
    i32.const 117
    i32.const 110
    i32.const 100
    i32.const 58
    i32.const 35
    i32.const 48
    i32.const 98
    i32.const 49
    i32.const 48
    i32.const 50
    i32.const 48
    i32.const 59
    i32.const 98
    i32.const 111
    i32.const 114
    i32.const 100
    i32.const 101
    i32.const 114
    i32.const 45
    i32.const 114
    i32.const 97
    i32.const 100
    i32.const 105
    i32.const 117
    i32.const 115
    i32.const 58
    i32.const 56
    i32.const 112
    i32.const 120
    i32.const 59
    i32.const 99
    i32.const 117
    i32.const 114
    i32.const 115
    i32.const 111
    i32.const 114
    i32.const 58
    i32.const 99
    i32.const 114
    i32.const 111
    i32.const 115
    i32.const 115
    i32.const 104
    i32.const 97
    i32.const 105
    i32.const 114
    array.new_fixed $WasmStr 64
    call $attr_ref78
    ref.func $closure_46
    struct.new $ClosureType_117
    call $onPointer_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    struct.new $ListCons_99
    struct.new $ListCons_99
    struct.new $ListCons_99
    call $canvas_ref78
    i32.const 103
    i32.const 114
    i32.const 105
    i32.const 100
    array.new_fixed $WasmStr 4
    call $class$0027_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    i32.const 1
    struct.new $Life_Msg#1
    call $onClick_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    local.get $m
    struct.get $Life_Model 1
    if (result (ref $WasmStr))
      i32.const 112
      i32.const 97
      i32.const 117
      i32.const 115
      i32.const 101
      array.new_fixed $WasmStr 5
    else
      i32.const 114
      i32.const 117
      i32.const 110
      array.new_fixed $WasmStr 3
    end
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $button_ref78
    i32.const 115
    i32.const 101
    i32.const 99
    i32.const 111
    i32.const 110
    i32.const 100
    i32.const 97
    i32.const 114
    i32.const 121
    array.new_fixed $WasmStr 9
    call $class$0027_ref78
    i32.const 2
    struct.new $Life_Msg#2
    call $onClick_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    struct.new $ListCons_99
    i32.const 115
    i32.const 116
    i32.const 101
    i32.const 112
    array.new_fixed $WasmStr 4
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $button_ref78
    i32.const 115
    i32.const 101
    i32.const 99
    i32.const 111
    i32.const 110
    i32.const 100
    i32.const 97
    i32.const 114
    i32.const 121
    array.new_fixed $WasmStr 9
    call $class$0027_ref78
    i32.const 3
    struct.new $Life_Msg#3
    call $onClick_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    struct.new $ListCons_99
    i32.const 114
    i32.const 97
    i32.const 110
    i32.const 100
    i32.const 111
    i32.const 109
    i32.const 105
    i32.const 122
    i32.const 101
    array.new_fixed $WasmStr 9
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $button_ref78
    i32.const 111
    i32.const 117
    i32.const 116
    i32.const 108
    i32.const 105
    i32.const 110
    i32.const 101
    array.new_fixed $WasmStr 7
    call $class$0027_ref78
    i32.const 4
    struct.new $Life_Msg#4
    call $onClick_ref78
    ref.null $ListBase
    struct.new $ListCons_99
    struct.new $ListCons_99
    i32.const 99
    i32.const 108
    i32.const 101
    i32.const 97
    i32.const 114
    array.new_fixed $WasmStr 5
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $button_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    struct.new $ListCons_93
    struct.new $ListCons_93
    struct.new $ListCons_93
    call $div_ref78
    ref.null $ListBase
    i32.const 103
    i32.const 101
    i32.const 110
    i32.const 101
    i32.const 114
    i32.const 97
    i32.const 116
    i32.const 105
    i32.const 111
    i32.const 110
    i32.const 32
    array.new_fixed $WasmStr 11
    local.get $m
    struct.get $Life_Model 2
    call $intToStr
    call $strConcat
    i32.const 32
    i32.const 183
    i32.const 32
    array.new_fixed $WasmStr 3
    call $strConcat
    local.get $alive
    call $intToStr
    call $strConcat
    i32.const 32
    i32.const 99
    i32.const 101
    i32.const 108
    i32.const 108
    i32.const 115
    i32.const 32
    i32.const 97
    i32.const 108
    i32.const 105
    i32.const 118
    i32.const 101
    i32.const 32
    i32.const 183
    i32.const 32
    i32.const 99
    i32.const 108
    i32.const 105
    i32.const 99
    i32.const 107
    i32.const 32
    i32.const 116
    i32.const 104
    i32.const 101
    i32.const 32
    i32.const 99
    i32.const 97
    i32.const 110
    i32.const 118
    i32.const 97
    i32.const 115
    i32.const 32
    i32.const 116
    i32.const 111
    i32.const 32
    i32.const 100
    i32.const 114
    i32.const 97
    i32.const 119
    array.new_fixed $WasmStr 39
    call $strConcat
    call $text_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    call $small_ref78
    ref.null $ListBase
    struct.new $ListCons_93
    struct.new $ListCons_93
    struct.new $ListCons_93
    struct.new $ListCons_93
    return_call $article_ref78
  )
  (func $draw (param $m (ref $Life_Model)) ;; exported as "draw"
    (local $y i32)
    (local $limit i32)
    (local $x i32)
    (local $limit_1 i32)
    i32.const 725024
    call $canvas_clear
    i32.const 0
    local.set $y
    call $rows
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $y
      local.get $limit
      i32.le_s
      if
        i32.const 0
        local.set $x
        call $cols
        i32.const 1
        i32.sub
        local.set $limit_1
        loop $for
          local.get $x
          local.get $limit_1
          i32.le_s
          if
            local.get $m
            struct.get $Life_Model 0
            local.get $y
            call $cols
            i32.mul
            local.get $x
            i32.add
            array.get $GcArray_77
            i32.const 1
            i32.eq
            if
              local.get $x
              call $cell
              i32.mul
              local.get $y
              call $cell
              i32.mul
              call $cell
              i32.const 1
              i32.sub
              call $cell
              i32.const 1
              i32.sub
              i32.const 8189376
              call $canvas_fillRect
            end
            local.get $x
            i32.const 1
            i32.add
            local.set $x
            br $for
          end
        end
        local.get $y
        i32.const 1
        i32.add
        local.set $y
        br $for
      end
    end
  )
  (func $closure_53 (param $self (ref $AnyFn)) (param $m (ref $Life_Model)) (result (ref $Life_Model))
    (local $self_cast (ref $ClosureType_131))
    (local $msg (ref $Life_Msg))
    local.get $self
    ref.cast (ref $ClosureType_131)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_131 1
    local.set $msg
    local.get $msg
    local.get $m
    return_call $update
  )
  (func $closure_52 (param $self (ref $AnyFn)) (param $msg (ref $Life_Msg)) (result (ref $AnyFn))
    ref.func $closure_53
    local.get $msg
    struct.new $ClosureType_131
  )
  (func $closure_54 (param $self (ref $AnyFn)) (param $m_1 (ref $Life_Model)) (result (ref $Browser_Elmish_Html`1<ref78>))
    local.get $m_1
    return_call $view
  )
  (func $closure_55 (param $self (ref $AnyFn)) (param $m_2 (ref $Life_Model))
    local.get $m_2
    call $draw
  )
  (func $closure_59 (param $self (ref $AnyFn)) (param $kind (ref $WasmStr)) (param $h (ref $AnyFn))
    (local $self_cast (ref $ClosureType_136))
    (local $handlers (ref $ResizeArray_36))
    (local $sb (ref $StringBuilder))
    (local $w33 i32)
    (local $w34 (ref $GcArray_35))
    (local $w35 i32)
    (local $w36 (ref $GcArray_35))
    (local $value (ref $StringBuilder))
    local.get $self
    ref.cast (ref $ClosureType_136)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_136 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_136 2
    local.set $sb
    local.get $handlers
    struct.get $ResizeArray_36 1
    local.set $w33
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.set $w34
    local.get $w33
    local.get $w34
    array.len
    i32.ge_u
    if
      local.get $w34
      array.len
      i32.const 1
      i32.shl
      local.set $w35
      ref.null $AnyFn
      local.get $w35
      array.new $GcArray_35
      local.set $w36
      local.get $w36
      i32.const 0
      local.get $w34
      i32.const 0
      local.get $w33
      array.copy $GcArray_35 $GcArray_35
      local.get $handlers
      local.get $w36
      struct.set $ResizeArray_36 0
    end
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.get $w33
    local.get $h
    array.set $GcArray_35
    local.get $handlers
    local.get $w33
    i32.const 1
    i32.add
    struct.set $ResizeArray_36 1
    local.get $sb
    i32.const 32
    i32.const 100
    i32.const 97
    i32.const 116
    i32.const 97
    i32.const 45
    i32.const 101
    i32.const 118
    i32.const 61
    i32.const 34
    array.new_fixed $WasmStr 10
    call $sbAppend
    local.get $handlers
    struct.get $ResizeArray_36 1
    i32.const 1
    i32.sub
    call $intToStr
    call $sbAppend
    i32.const 34
    i32.const 32
    i32.const 100
    i32.const 97
    i32.const 116
    i32.const 97
    i32.const 45
    i32.const 111
    i32.const 110
    i32.const 61
    i32.const 34
    array.new_fixed $WasmStr 11
    call $sbAppend
    local.get $kind
    call $sbAppend
    i32.const 34
    array.new_fixed $WasmStr 1
    call $sbAppend
    local.set $value
  )
  (func $closure_60 (param $self (ref $AnyFn)) (param $_arg (ref $WasmStr)) (result (ref $Life_Msg))
    (local $self_cast (ref $ClosureType_139))
    local.get $self
    ref.cast (ref $ClosureType_139)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_139 1
  )
  (func $closure_63 (param $self (ref $AnyFn)) (param $xy (ref $WasmStr)) (result (ref $Life_Msg))
    (local $self_cast (ref $ClosureType_142))
    (local $f_1 (ref $AnyFn))
    (local $parts (ref $GcArray_47))
    (local $ap_arg_64_0 i32)
    (local $ap_arg_64_1 i32)
    (local $lo_tail_5 (ref $ClosureBase_141))
    (local $lo_tail_7 (ref $ClosureBase_101))
    (local $lo_clo_6 (ref $ClosureBase_31))
    local.get $self
    ref.cast (ref $ClosureType_142)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_142 1
    local.set $f_1
    local.get $xy
    i32.const 44
    array.new_fixed $WasmStr 1
    call $strSplit
    local.set $parts
    local.get $parts
    i32.const 0
    array.get $GcArray_47
    ref.cast (ref $WasmStr)
    call $parseInt
    local.set $ap_arg_64_0
    local.get $parts
    i32.const 1
    array.get $GcArray_47
    ref.cast (ref $WasmStr)
    call $parseInt
    local.set $ap_arg_64_1
    local.get $f_1
    ref.test (ref $ClosureBase_141)
    if (result (ref $Life_Msg))
      local.get $f_1
      ref.cast (ref $ClosureBase_141)
      local.set $lo_tail_5
      local.get $lo_tail_5
      local.get $ap_arg_64_0
      local.get $ap_arg_64_1
      local.get $lo_tail_5
      struct.get $ClosureBase_141 0
      return_call_ref $FuncType_140
    else
      local.get $f_1
      ref.cast (ref $ClosureBase_31)
      local.set $lo_clo_6
      local.get $lo_clo_6
      local.get $ap_arg_64_0
      local.get $lo_clo_6
      struct.get $ClosureBase_31 0
      call_ref $FuncType_30
      ref.cast (ref $ClosureBase_101)
      local.set $lo_tail_7
      local.get $lo_tail_7
      local.get $ap_arg_64_1
      local.get $lo_tail_7
      struct.get $ClosureBase_101 0
      return_call_ref $FuncType_100
    end
  )
  (func $renderAttr_ref78 (param $handlers (ref $ResizeArray_36)) (param $sb (ref $StringBuilder)) (param $a (ref $Browser_Elmish_Attr`1<ref78>))
    (local $register (ref $ClosureType_136))
    (local $msg (ref $Life_Msg))
    (local $ap_arg_61_0 (ref $WasmStr))
    (local $ap_arg_61_1 (ref $ClosureType_139))
    (local $lo_clo_8 (ref $ClosureBase_38))
    (local $lo_clo_10 (ref $ClosureBase_46))
    (local $lo_clo_9 (ref $ClosureBase_44))
    (local $f (ref $AnyFn))
    (local $ap_arg_62_0 (ref $WasmStr))
    (local $lo_clo_11 (ref $ClosureBase_38))
    (local $lo_clo_13 (ref $ClosureBase_46))
    (local $lo_clo_12 (ref $ClosureBase_44))
    (local $f_1 (ref $AnyFn))
    (local $ap_arg_65_0 (ref $WasmStr))
    (local $ap_arg_65_1 (ref $ClosureType_142))
    (local $lo_clo_14 (ref $ClosureBase_38))
    (local $lo_clo_16 (ref $ClosureBase_46))
    (local $lo_clo_15 (ref $ClosureBase_44))
    (local $v (ref $WasmStr))
    (local $k (ref $WasmStr))
    (local $value_1 (ref $StringBuilder))
    ref.func $closure_59
    local.get $handlers
    local.get $sb
    struct.new $ClosureType_136
    local.set $register
    local.get $a
    struct.get $Browser_Elmish_Attr`1<ref78> 0
    i32.const 1
    i32.eq
    if
      local.get $a
      ref.cast (ref $Browser_Elmish_Attr`1<ref78>#1)
      struct.get $Browser_Elmish_Attr`1<ref78>#1 1
      local.set $msg
      i32.const 99
      i32.const 108
      i32.const 105
      i32.const 99
      i32.const 107
      array.new_fixed $WasmStr 5
      local.set $ap_arg_61_0
      ref.func $closure_60
      local.get $msg
      struct.new $ClosureType_139
      local.set $ap_arg_61_1
      local.get $register
      ref.test (ref $ClosureBase_38)
      if
        local.get $register
        ref.cast (ref $ClosureBase_38)
        local.set $lo_clo_8
        local.get $lo_clo_8
        local.get $ap_arg_61_0
        local.get $ap_arg_61_1
        local.get $lo_clo_8
        struct.get $ClosureBase_38 0
        call_ref $FuncType_37
      else
        local.get $register
        ref.cast (ref $ClosureBase_44)
        local.set $lo_clo_9
        local.get $lo_clo_9
        local.get $ap_arg_61_0
        local.get $lo_clo_9
        struct.get $ClosureBase_44 0
        call_ref $FuncType_43
        ref.cast (ref $ClosureBase_46)
        local.set $lo_clo_10
        local.get $lo_clo_10
        local.get $ap_arg_61_1
        local.get $lo_clo_10
        struct.get $ClosureBase_46 0
        call_ref $FuncType_45
      end
    else
      local.get $a
      struct.get $Browser_Elmish_Attr`1<ref78> 0
      i32.const 2
      i32.eq
      if
        local.get $a
        ref.cast (ref $Browser_Elmish_Attr`1<ref78>#2)
        struct.get $Browser_Elmish_Attr`1<ref78>#2 1
        local.set $f
        i32.const 105
        i32.const 110
        i32.const 112
        i32.const 117
        i32.const 116
        array.new_fixed $WasmStr 5
        local.set $ap_arg_62_0
        local.get $register
        ref.test (ref $ClosureBase_38)
        if
          local.get $register
          ref.cast (ref $ClosureBase_38)
          local.set $lo_clo_11
          local.get $lo_clo_11
          local.get $ap_arg_62_0
          local.get $f
          local.get $lo_clo_11
          struct.get $ClosureBase_38 0
          call_ref $FuncType_37
        else
          local.get $register
          ref.cast (ref $ClosureBase_44)
          local.set $lo_clo_12
          local.get $lo_clo_12
          local.get $ap_arg_62_0
          local.get $lo_clo_12
          struct.get $ClosureBase_44 0
          call_ref $FuncType_43
          ref.cast (ref $ClosureBase_46)
          local.set $lo_clo_13
          local.get $lo_clo_13
          local.get $f
          local.get $lo_clo_13
          struct.get $ClosureBase_46 0
          call_ref $FuncType_45
        end
      else
        local.get $a
        struct.get $Browser_Elmish_Attr`1<ref78> 0
        i32.const 3
        i32.eq
        if
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref78>#3)
          struct.get $Browser_Elmish_Attr`1<ref78>#3 1
          local.set $f_1
          i32.const 99
          i32.const 108
          i32.const 105
          i32.const 99
          i32.const 107
          array.new_fixed $WasmStr 5
          local.set $ap_arg_65_0
          ref.func $closure_63
          local.get $f_1
          struct.new $ClosureType_142
          local.set $ap_arg_65_1
          local.get $register
          ref.test (ref $ClosureBase_38)
          if
            local.get $register
            ref.cast (ref $ClosureBase_38)
            local.set $lo_clo_14
            local.get $lo_clo_14
            local.get $ap_arg_65_0
            local.get $ap_arg_65_1
            local.get $lo_clo_14
            struct.get $ClosureBase_38 0
            call_ref $FuncType_37
          else
            local.get $register
            ref.cast (ref $ClosureBase_44)
            local.set $lo_clo_15
            local.get $lo_clo_15
            local.get $ap_arg_65_0
            local.get $lo_clo_15
            struct.get $ClosureBase_44 0
            call_ref $FuncType_43
            ref.cast (ref $ClosureBase_46)
            local.set $lo_clo_16
            local.get $lo_clo_16
            local.get $ap_arg_65_1
            local.get $lo_clo_16
            struct.get $ClosureBase_46 0
            call_ref $FuncType_45
          end
        else
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref78>#0)
          struct.get $Browser_Elmish_Attr`1<ref78>#0 2
          local.set $v
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref78>#0)
          struct.get $Browser_Elmish_Attr`1<ref78>#0 1
          local.set $k
          local.get $sb
          i32.const 32
          array.new_fixed $WasmStr 1
          call $sbAppend
          local.get $k
          call $sbAppend
          i32.const 61
          i32.const 34
          array.new_fixed $WasmStr 2
          call $sbAppend
          local.get $v
          call $escape
          call $sbAppend
          i32.const 34
          array.new_fixed $WasmStr 1
          call $sbAppend
          local.set $value_1
        end
      end
    end
  )
  (func $renderTo_ref78 (param $handlers (ref $ResizeArray_36)) (param $sb (ref $StringBuilder)) (param $html (ref $Browser_Elmish_Html`1<ref78>))
    (local $tag (ref $WasmStr))
    (local $children (ref null $ListBase))
    (local $attrs (ref null $ListBase))
    (local $value_1 (ref $StringBuilder))
    (local $w38 (ref null $ListBase))
    (local $a (ref $Browser_Elmish_Attr`1<ref78>))
    (local $value_2 (ref $StringBuilder))
    (local $w41 (ref null $ListBase))
    (local $html_1 (ref $Browser_Elmish_Html`1<ref78>))
    (local $value_3 (ref $StringBuilder))
    (local $s (ref $WasmStr))
    (local $value (ref $StringBuilder))
    local.get $html
    struct.get $Browser_Elmish_Html`1<ref78> 0
    i32.const 1
    i32.eq
    if
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref78>#1)
      struct.get $Browser_Elmish_Html`1<ref78>#1 1
      local.set $tag
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref78>#1)
      struct.get $Browser_Elmish_Html`1<ref78>#1 3
      local.set $children
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref78>#1)
      struct.get $Browser_Elmish_Html`1<ref78>#1 2
      local.set $attrs
      local.get $sb
      i32.const 60
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.get $tag
      call $sbAppend
      local.set $value_1
      local.get $attrs
      local.set $w38
      block $while_39_exit
        loop $while_39_lp
          local.get $w38
          ref.is_null
          i32.eqz
          if
            local.get $w38
            ref.cast (ref $ListCons_99)
            struct.get $ListCons_99 0
            local.set $a
            local.get $handlers
            local.get $sb
            local.get $a
            call $renderAttr_ref78
            local.get $w38
            ref.cast (ref $ListCons_99)
            struct.get $ListCons_99 1
            local.set $w38
            br $while_39_lp
          else
            br $while_39_exit
          end
        end
      end
      local.get $sb
      i32.const 62
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.set $value_2
      local.get $children
      local.set $w41
      block $while_42_exit
        loop $while_42_lp
          local.get $w41
          ref.is_null
          i32.eqz
          if
            local.get $w41
            ref.cast (ref $ListCons_93)
            struct.get $ListCons_93 0
            local.set $html_1
            local.get $handlers
            local.get $sb
            local.get $html_1
            call $renderTo_ref78
            local.get $w41
            ref.cast (ref $ListCons_93)
            struct.get $ListCons_93 1
            local.set $w41
            br $while_42_lp
          else
            br $while_42_exit
          end
        end
      end
      local.get $sb
      i32.const 60
      i32.const 47
      array.new_fixed $WasmStr 2
      call $sbAppend
      local.get $tag
      call $sbAppend
      i32.const 62
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.set $value_3
    else
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref78>#0)
      struct.get $Browser_Elmish_Html`1<ref78>#0 1
      local.set $s
      local.get $sb
      local.get $s
      call $escape
      call $sbAppend
      local.set $value
    end
  )
  (func $closure_68 (param $self (ref $AnyFn)) (param $text (ref $WasmStr))
    (local $self_cast (ref $ClosureType_151))
    (local $handlers (ref $ResizeArray_36))
    (local $id i32)
    (local $model (ref $RefCell_135))
    (local $p (ref $Browser_Elmish_Program`2<ref76~ref78>))
    (local $render (ref $AnyFn))
    (local $ap_clo_69 (ref $AnyFn))
    (local $ap_arg_69_0 (ref $Life_Msg))
    (local $lo_clo_17 (ref $ClosureBase_138))
    (local $ap_arg_69_1 (ref $Life_Model))
    (local $lo_clo_18 (ref $ClosureBase_150))
    (local $lo_clo_20 (ref $ClosureBase_120))
    (local $lo_clo_19 (ref $ClosureBase_123))
    (local $lo_clo_21 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_151)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_151 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_151 2
    local.set $id
    local.get $self_cast
    struct.get $ClosureType_151 3
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_151 4
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_151 5
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 1
    local.set $ap_clo_69
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.get $id
    array.get $GcArray_35
    ref.cast (ref $AnyFn)
    ref.cast (ref $ClosureBase_138)
    local.set $lo_clo_17
    local.get $lo_clo_17
    local.get $text
    local.get $lo_clo_17
    struct.get $ClosureBase_138 0
    call_ref $FuncType_137
    local.set $ap_arg_69_0
    local.get $model
    struct.get $RefCell_135 0
    local.set $ap_arg_69_1
    local.get $ap_clo_69
    ref.test (ref $ClosureBase_150)
    if (result (ref $Life_Model))
      local.get $ap_clo_69
      ref.cast (ref $ClosureBase_150)
      local.set $lo_clo_18
      local.get $lo_clo_18
      local.get $ap_arg_69_0
      local.get $ap_arg_69_1
      local.get $lo_clo_18
      struct.get $ClosureBase_150 0
      call_ref $FuncType_149
    else
      local.get $ap_clo_69
      ref.cast (ref $ClosureBase_123)
      local.set $lo_clo_19
      local.get $lo_clo_19
      local.get $ap_arg_69_0
      local.get $lo_clo_19
      struct.get $ClosureBase_123 0
      call_ref $FuncType_122
      ref.cast (ref $ClosureBase_120)
      local.set $lo_clo_20
      local.get $lo_clo_20
      local.get $ap_arg_69_1
      local.get $lo_clo_20
      struct.get $ClosureBase_120 0
      call_ref $FuncType_119
    end
    struct.set $RefCell_135 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_21
    local.get $lo_clo_21
    local.get $lo_clo_21
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $closure_67 (param $self (ref $AnyFn)) (param $id i32) (result (ref $AnyFn))
    (local $self_cast (ref $ClosureType_152))
    (local $handlers (ref $ResizeArray_36))
    (local $model (ref $RefCell_135))
    (local $p (ref $Browser_Elmish_Program`2<ref76~ref78>))
    (local $render (ref $AnyFn))
    local.get $self
    ref.cast (ref $ClosureType_152)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_152 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_152 2
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_152 3
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_152 4
    local.set $render
    ref.func $closure_68
    local.get $handlers
    local.get $id
    local.get $model
    local.get $p
    local.get $render
    struct.new $ClosureType_151
  )
  (func $letrec_render_57 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_153))
    (local $model (ref $RefCell_135))
    (local $p (ref $Browser_Elmish_Program`2<ref76~ref78>))
    (local $handlers (ref $ResizeArray_36))
    (local $sb (ref $StringBuilder))
    (local $lo_clo_22 (ref $ClosureBase_126))
    (local $lo_clo_23 (ref $ClosureBase_129))
    local.get $self
    ref.cast (ref $ClosureType_153)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_153 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_153 2
    local.set $p
    ref.null $AnyFn
    i32.const 4
    array.new $GcArray_35
    i32.const 0
    struct.new $ResizeArray_36
    local.set $handlers
    i32.const 16
    call $sbCreate
    local.set $sb
    local.get $handlers
    local.get $sb
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 2
    ref.cast (ref $ClosureBase_126)
    local.set $lo_clo_22
    local.get $lo_clo_22
    local.get $model
    struct.get $RefCell_135 0
    local.get $lo_clo_22
    struct.get $ClosureBase_126 0
    call_ref $FuncType_125
    call $renderTo_ref78
    i32.const 0
    local.get $sb
    call $sbToString
    call $send
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 5
    ref.cast (ref $ClosureBase_129)
    local.set $lo_clo_23
    local.get $lo_clo_23
    local.get $model
    struct.get $RefCell_135 0
    local.get $lo_clo_23
    struct.get $ClosureBase_129 0
    call_ref $FuncType_128
    ref.func $closure_67
    local.get $handlers
    local.get $model
    local.get $p
    local.get $self
    struct.new $ClosureType_152
    global.set $handlerSlot
  )
  (func $closure_70 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_154))
    (local $model (ref $RefCell_135))
    (local $p (ref $Browser_Elmish_Program`2<ref76~ref78>))
    (local $render (ref $AnyFn))
    (local $ap_clo_71 (ref $AnyFn))
    (local $ap_arg_71_0 (ref $Life_Msg))
    (local $ap_arg_71_1 (ref $Life_Model))
    (local $lo_clo_24 (ref $ClosureBase_150))
    (local $lo_clo_26 (ref $ClosureBase_120))
    (local $lo_clo_25 (ref $ClosureBase_123))
    (local $lo_clo_27 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_154)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_154 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_154 2
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_154 3
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 1
    local.set $ap_clo_71
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 4
    local.set $ap_arg_71_0
    local.get $model
    struct.get $RefCell_135 0
    local.set $ap_arg_71_1
    local.get $ap_clo_71
    ref.test (ref $ClosureBase_150)
    if (result (ref $Life_Model))
      local.get $ap_clo_71
      ref.cast (ref $ClosureBase_150)
      local.set $lo_clo_24
      local.get $lo_clo_24
      local.get $ap_arg_71_0
      local.get $ap_arg_71_1
      local.get $lo_clo_24
      struct.get $ClosureBase_150 0
      call_ref $FuncType_149
    else
      local.get $ap_clo_71
      ref.cast (ref $ClosureBase_123)
      local.set $lo_clo_25
      local.get $lo_clo_25
      local.get $ap_arg_71_0
      local.get $lo_clo_25
      struct.get $ClosureBase_123 0
      call_ref $FuncType_122
      ref.cast (ref $ClosureBase_120)
      local.set $lo_clo_26
      local.get $lo_clo_26
      local.get $ap_arg_71_1
      local.get $lo_clo_26
      struct.get $ClosureBase_120 0
      call_ref $FuncType_119
    end
    struct.set $RefCell_135 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_27
    local.get $lo_clo_27
    local.get $lo_clo_27
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $run_ref76~ref78 (param $p (ref $Browser_Elmish_Program`2<ref76~ref78>))
    (local $model (ref $RefCell_135))
    (local $render (ref $ClosureType_153))
    (local $lo_clo_28 (ref $ClosureBase_5))
    (local $value i32)
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 0
    struct.new $RefCell_135
    local.set $model
    ref.func $letrec_render_57
    local.get $model
    local.get $p
    struct.new $ClosureType_153
    local.set $render
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_28
    local.get $lo_clo_28
    local.get $lo_clo_28
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref76~ref78> 3
    i32.const 0
    i32.gt_s
    if
      local.get $p
      struct.get $Browser_Elmish_Program`2<ref76~ref78> 3
      ref.func $closure_70
      local.get $model
      local.get $p
      local.get $render
      struct.new $ClosureType_154
      call $every
      local.set $value
    end
  )
  (func $main ;; exported as "main"
    i32.const 12345
    call $random
    ref.func $closure_52
    struct.new $ClosureType_132
    ref.func $closure_54
    struct.new $ClosureType_133
    i32.const 60
    i32.const 0
    struct.new $Life_Msg#0
    ref.func $closure_55
    struct.new $ClosureType_134
    struct.new $Browser_Elmish_Program`2<ref76~ref78>
    call $run_ref76~ref78
  )
  (func $__init
    call $tickSlot$init
    global.set $tickSlot
    call $inbox$init
    global.set $inbox
    call $handlerSlot$init
    global.set $handlerSlot
  )
  ;; ── Elem declare (func refs) ────────────────────────
  (elem declare func $closure_1 $closure_2 $closure_3 $closure_46 $closure_47 $closure_52 $closure_53 $closure_54 $closure_55 $closure_59 $closure_60 $closure_63 $closure_67 $closure_68 $closure_70 $letrec_render_57)
  (start $__init)
  ;; ── Exports ────────────────────────────────────────
  (export "tick" (func $tick))
  (export "every" (func $every))
  (export "send" (func $send))
  (export "inboxClear" (func $inboxClear))
  (export "inboxPut" (func $inboxPut))
  (export "inboxText" (func $inboxText))
  (export "escape" (func $escape))
  (export "dispatch" (func $dispatch))
  (export "cols" (func $cols))
  (export "rows" (func $rows))
  (export "cell" (func $cell))
  (export "next" (func $next))
  (export "random" (func $random))
  (export "neighbours" (func $neighbours))
  (export "step" (func $step))
  (export "update" (func $update))
  (export "view" (func $view))
  (export "draw" (func $draw))
  (export "main" (func $main))
  ;; ── Globals ─────────────────────────────────────────
  (global $fsharp_exn_carrier (mut anyref)ref.null any
)
  (global $tickSlot (mut (ref null $AnyFn))ref.null $AnyFn
)
  (global $inbox (mut (ref null $WasmStr))ref.null $WasmStr
)
  (global $handlerSlot (mut (ref null $AnyFn))ref.null $AnyFn
)
)
