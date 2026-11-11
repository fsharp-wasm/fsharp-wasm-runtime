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
  (type $ClosureType_76 (sub $ClosureBase_52 (struct (field (ref $FuncType_51)) (field i32))))
  (type $ClosureType_77 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_78 (sub $ClosureBase_68 (struct (field (ref $FuncType_67)))))
  (type $ClosureType_79 (sub $ClosureBase_52 (struct (field (ref $FuncType_51)) (field i32))))
  (type $ClosureType_80 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_81 (sub $ClosureBase_68 (struct (field (ref $FuncType_67)))))
  (type $ClosureType_82 (sub $ClosureBase_70 (struct (field (ref $FuncType_69)))))
  (type $ClosureType_83 (sub $ClosureBase_52 (struct (field (ref $FuncType_51)) (field i32))))
  (type $ClosureType_84 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_85 (sub $ClosureBase_68 (struct (field (ref $FuncType_67)))))
  (type $ClosureType_86 (sub $ClosureBase_52 (struct (field (ref $FuncType_51)) (field i32))))
  (type $ClosureType_87 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)))))
  (type $ClosureType_88 (sub $ClosureBase_68 (struct (field (ref $FuncType_67)))))
  (type $ClosureType_89 (sub $ClosureBase_28 (struct (field (ref $FuncType_27)) (field (ref $ResizeArray_36)) (field i32) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_90 (sub $ClosureBase_31 (struct (field (ref $FuncType_30)) (field (ref $ResizeArray_36)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_91 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)))))
  (type $ClosureType_92 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_66)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  ;; ── Imports ────────────────────────────────────────
  (import "browser" "commit" (func $browser_commit (param i32)))
  (import "timing" "setInterval" (func $timing_setInterval (param i32) (result i32)))
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
    (local $w24 i32)
    (local $w25 i32)
    (local $w26 i32)
    (local $w27 i32)
    local.get $strIdx_ha
    array.len
    local.set $w24
    local.get $strIdx_ne
    array.len
    local.set $w25
    block $strIdx_23_outer (result i32)
      local.get $w25
      i32.const 0
      i32.eq
      if
        i32.const 0
        br $strIdx_23_outer
      end
      i32.const 0
      local.set $w26
      block $while_29_exit
        loop $while_29_lp
          local.get $w26
          local.get $w24
          local.get $w25
          i32.sub
          i32.le_s
          if
            block $strIdx_23_match
              i32.const 0
              local.set $w27
              block $while_28_exit
                loop $while_28_lp
                  local.get $w27
                  local.get $w25
                  i32.lt_s
                  if
                    local.get $strIdx_ha
                    local.get $w26
                    local.get $w27
                    i32.add
                    array.get $WasmStr
                    local.get $strIdx_ne
                    local.get $w27
                    array.get $WasmStr
                    i32.ne
                    if
                      br $strIdx_23_match
                    end
                    local.get $w27
                    i32.const 1
                    i32.add
                    local.set $w27
                    br $while_28_lp
                  else
                    br $while_28_exit
                  end
                end
              end
              local.get $w26
              br $strIdx_23_outer
            end
            local.get $w26
            i32.const 1
            i32.add
            local.set $w26
            br $while_29_lp
          else
            br $while_29_exit
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
  (func $el_i32 (param $tag (ref $WasmStr)) (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<i32>))
    i32.const 1
    local.get $tag
    local.get $attrs
    local.get $children
    struct.new $Browser_Elmish_Html`1<i32>#1
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
  (func $closure_13 (param $self (ref $AnyFn)) (param $kind (ref $WasmStr)) (param $h (ref $AnyFn))
    (local $self_cast (ref $ClosureType_54))
    (local $handlers (ref $ResizeArray_36))
    (local $sb (ref $StringBuilder))
    (local $w7 i32)
    (local $w8 (ref $GcArray_35))
    (local $w9 i32)
    (local $w10 (ref $GcArray_35))
    (local $value (ref $StringBuilder))
    local.get $self
    ref.cast (ref $ClosureType_54)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_54 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_54 2
    local.set $sb
    local.get $handlers
    struct.get $ResizeArray_36 1
    local.set $w7
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.set $w8
    local.get $w7
    local.get $w8
    array.len
    i32.ge_u
    if
      local.get $w8
      array.len
      i32.const 1
      i32.shl
      local.set $w9
      ref.null $AnyFn
      local.get $w9
      array.new $GcArray_35
      local.set $w10
      local.get $w10
      i32.const 0
      local.get $w8
      i32.const 0
      local.get $w7
      array.copy $GcArray_35 $GcArray_35
      local.get $handlers
      local.get $w10
      struct.set $ResizeArray_36 0
    end
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.get $w7
    local.get $h
    array.set $GcArray_35
    local.get $handlers
    local.get $w7
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
  (func $closure_14 (param $self (ref $AnyFn)) (param $_arg (ref $WasmStr)) (result i32)
    (local $self_cast (ref $ClosureType_55))
    local.get $self
    ref.cast (ref $ClosureType_55)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_55 1
  )
  (func $closure_17 (param $self (ref $AnyFn)) (param $xy (ref $WasmStr)) (result i32)
    (local $self_cast (ref $ClosureType_56))
    (local $f_1 (ref $AnyFn))
    (local $parts (ref $GcArray_47))
    (local $ap_arg_18_0 i32)
    (local $ap_arg_18_1 i32)
    (local $lo_tail_5 (ref $ClosureBase_50))
    (local $lo_tail_7 (ref $ClosureBase_52))
    (local $lo_clo_6 (ref $ClosureBase_31))
    local.get $self
    ref.cast (ref $ClosureType_56)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_56 1
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
    local.set $ap_arg_18_0
    local.get $parts
    i32.const 1
    array.get $GcArray_47
    ref.cast (ref $WasmStr)
    call $parseInt
    local.set $ap_arg_18_1
    local.get $f_1
    ref.test (ref $ClosureBase_50)
    if (result i32)
      local.get $f_1
      ref.cast (ref $ClosureBase_50)
      local.set $lo_tail_5
      local.get $lo_tail_5
      local.get $ap_arg_18_0
      local.get $ap_arg_18_1
      local.get $lo_tail_5
      struct.get $ClosureBase_50 0
      return_call_ref $FuncType_49
    else
      local.get $f_1
      ref.cast (ref $ClosureBase_31)
      local.set $lo_clo_6
      local.get $lo_clo_6
      local.get $ap_arg_18_0
      local.get $lo_clo_6
      struct.get $ClosureBase_31 0
      call_ref $FuncType_30
      ref.cast (ref $ClosureBase_52)
      local.set $lo_tail_7
      local.get $lo_tail_7
      local.get $ap_arg_18_1
      local.get $lo_tail_7
      struct.get $ClosureBase_52 0
      return_call_ref $FuncType_51
    end
  )
  (func $renderAttr_i32 (param $handlers (ref $ResizeArray_36)) (param $sb (ref $StringBuilder)) (param $a (ref $Browser_Elmish_Attr`1<i32>))
    (local $register (ref $ClosureType_54))
    (local $msg i32)
    (local $ap_arg_15_0 (ref $WasmStr))
    (local $ap_arg_15_1 (ref $ClosureType_55))
    (local $lo_clo_8 (ref $ClosureBase_38))
    (local $lo_clo_10 (ref $ClosureBase_46))
    (local $lo_clo_9 (ref $ClosureBase_44))
    (local $f (ref $AnyFn))
    (local $ap_arg_16_0 (ref $WasmStr))
    (local $lo_clo_11 (ref $ClosureBase_38))
    (local $lo_clo_13 (ref $ClosureBase_46))
    (local $lo_clo_12 (ref $ClosureBase_44))
    (local $f_1 (ref $AnyFn))
    (local $ap_arg_19_0 (ref $WasmStr))
    (local $ap_arg_19_1 (ref $ClosureType_56))
    (local $lo_clo_14 (ref $ClosureBase_38))
    (local $lo_clo_16 (ref $ClosureBase_46))
    (local $lo_clo_15 (ref $ClosureBase_44))
    (local $v (ref $WasmStr))
    (local $k (ref $WasmStr))
    (local $value_1 (ref $StringBuilder))
    ref.func $closure_13
    local.get $handlers
    local.get $sb
    struct.new $ClosureType_54
    local.set $register
    local.get $a
    struct.get $Browser_Elmish_Attr`1<i32> 0
    i32.const 1
    i32.eq
    if
      local.get $a
      ref.cast (ref $Browser_Elmish_Attr`1<i32>#1)
      struct.get $Browser_Elmish_Attr`1<i32>#1 1
      local.set $msg
      i32.const 99
      i32.const 108
      i32.const 105
      i32.const 99
      i32.const 107
      array.new_fixed $WasmStr 5
      local.set $ap_arg_15_0
      ref.func $closure_14
      local.get $msg
      struct.new $ClosureType_55
      local.set $ap_arg_15_1
      local.get $register
      ref.test (ref $ClosureBase_38)
      if
        local.get $register
        ref.cast (ref $ClosureBase_38)
        local.set $lo_clo_8
        local.get $lo_clo_8
        local.get $ap_arg_15_0
        local.get $ap_arg_15_1
        local.get $lo_clo_8
        struct.get $ClosureBase_38 0
        call_ref $FuncType_37
      else
        local.get $register
        ref.cast (ref $ClosureBase_44)
        local.set $lo_clo_9
        local.get $lo_clo_9
        local.get $ap_arg_15_0
        local.get $lo_clo_9
        struct.get $ClosureBase_44 0
        call_ref $FuncType_43
        ref.cast (ref $ClosureBase_46)
        local.set $lo_clo_10
        local.get $lo_clo_10
        local.get $ap_arg_15_1
        local.get $lo_clo_10
        struct.get $ClosureBase_46 0
        call_ref $FuncType_45
      end
    else
      local.get $a
      struct.get $Browser_Elmish_Attr`1<i32> 0
      i32.const 2
      i32.eq
      if
        local.get $a
        ref.cast (ref $Browser_Elmish_Attr`1<i32>#2)
        struct.get $Browser_Elmish_Attr`1<i32>#2 1
        local.set $f
        i32.const 105
        i32.const 110
        i32.const 112
        i32.const 117
        i32.const 116
        array.new_fixed $WasmStr 5
        local.set $ap_arg_16_0
        local.get $register
        ref.test (ref $ClosureBase_38)
        if
          local.get $register
          ref.cast (ref $ClosureBase_38)
          local.set $lo_clo_11
          local.get $lo_clo_11
          local.get $ap_arg_16_0
          local.get $f
          local.get $lo_clo_11
          struct.get $ClosureBase_38 0
          call_ref $FuncType_37
        else
          local.get $register
          ref.cast (ref $ClosureBase_44)
          local.set $lo_clo_12
          local.get $lo_clo_12
          local.get $ap_arg_16_0
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
        struct.get $Browser_Elmish_Attr`1<i32> 0
        i32.const 3
        i32.eq
        if
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<i32>#3)
          struct.get $Browser_Elmish_Attr`1<i32>#3 1
          local.set $f_1
          i32.const 99
          i32.const 108
          i32.const 105
          i32.const 99
          i32.const 107
          array.new_fixed $WasmStr 5
          local.set $ap_arg_19_0
          ref.func $closure_17
          local.get $f_1
          struct.new $ClosureType_56
          local.set $ap_arg_19_1
          local.get $register
          ref.test (ref $ClosureBase_38)
          if
            local.get $register
            ref.cast (ref $ClosureBase_38)
            local.set $lo_clo_14
            local.get $lo_clo_14
            local.get $ap_arg_19_0
            local.get $ap_arg_19_1
            local.get $lo_clo_14
            struct.get $ClosureBase_38 0
            call_ref $FuncType_37
          else
            local.get $register
            ref.cast (ref $ClosureBase_44)
            local.set $lo_clo_15
            local.get $lo_clo_15
            local.get $ap_arg_19_0
            local.get $lo_clo_15
            struct.get $ClosureBase_44 0
            call_ref $FuncType_43
            ref.cast (ref $ClosureBase_46)
            local.set $lo_clo_16
            local.get $lo_clo_16
            local.get $ap_arg_19_1
            local.get $lo_clo_16
            struct.get $ClosureBase_46 0
            call_ref $FuncType_45
          end
        else
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<i32>#0)
          struct.get $Browser_Elmish_Attr`1<i32>#0 2
          local.set $v
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<i32>#0)
          struct.get $Browser_Elmish_Attr`1<i32>#0 1
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
  (func $renderTo_i32 (param $handlers (ref $ResizeArray_36)) (param $sb (ref $StringBuilder)) (param $html (ref $Browser_Elmish_Html`1<i32>))
    (local $tag (ref $WasmStr))
    (local $children (ref null $ListBase))
    (local $attrs (ref null $ListBase))
    (local $value_1 (ref $StringBuilder))
    (local $w15 (ref null $ListBase))
    (local $a (ref $Browser_Elmish_Attr`1<i32>))
    (local $value_2 (ref $StringBuilder))
    (local $w18 (ref null $ListBase))
    (local $html_1 (ref $Browser_Elmish_Html`1<i32>))
    (local $value_3 (ref $StringBuilder))
    (local $s (ref $WasmStr))
    (local $value (ref $StringBuilder))
    local.get $html
    struct.get $Browser_Elmish_Html`1<i32> 0
    i32.const 1
    i32.eq
    if
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<i32>#1)
      struct.get $Browser_Elmish_Html`1<i32>#1 1
      local.set $tag
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<i32>#1)
      struct.get $Browser_Elmish_Html`1<i32>#1 3
      local.set $children
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<i32>#1)
      struct.get $Browser_Elmish_Html`1<i32>#1 2
      local.set $attrs
      local.get $sb
      i32.const 60
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.get $tag
      call $sbAppend
      local.set $value_1
      local.get $attrs
      local.set $w15
      block $while_16_exit
        loop $while_16_lp
          local.get $w15
          ref.is_null
          i32.eqz
          if
            local.get $w15
            ref.cast (ref $ListCons_25)
            struct.get $ListCons_25 0
            local.set $a
            local.get $handlers
            local.get $sb
            local.get $a
            call $renderAttr_i32
            local.get $w15
            ref.cast (ref $ListCons_25)
            struct.get $ListCons_25 1
            local.set $w15
            br $while_16_lp
          else
            br $while_16_exit
          end
        end
      end
      local.get $sb
      i32.const 62
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.set $value_2
      local.get $children
      local.set $w18
      block $while_19_exit
        loop $while_19_lp
          local.get $w18
          ref.is_null
          i32.eqz
          if
            local.get $w18
            ref.cast (ref $ListCons_11)
            struct.get $ListCons_11 0
            local.set $html_1
            local.get $handlers
            local.get $sb
            local.get $html_1
            call $renderTo_i32
            local.get $w18
            ref.cast (ref $ListCons_11)
            struct.get $ListCons_11 1
            local.set $w18
            br $while_19_lp
          else
            br $while_19_exit
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
      ref.cast (ref $Browser_Elmish_Html`1<i32>#0)
      struct.get $Browser_Elmish_Html`1<i32>#0 1
      local.set $s
      local.get $sb
      local.get $s
      call $escape
      call $sbAppend
      local.set $value
    end
  )
  (func $update (param $msg i32) (param $model i32) (result i32) ;; exported as "update"
    local.get $msg
    i32.const 1
    i32.eq
    if (result i32)
      local.get $model
      i32.const 1
      i32.sub
    else
      local.get $msg
      i32.const 2
      i32.eq
      if (result i32)
        i32.const 0
      else
        local.get $model
        i32.const 1
        i32.add
      end
    end
  )
  (func $class$0027_i32 (param $name (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1<i32>))
    i32.const 0
    i32.const 99
    i32.const 108
    i32.const 97
    i32.const 115
    i32.const 115
    array.new_fixed $WasmStr 5
    local.get $name
    struct.new $Browser_Elmish_Attr`1<i32>#0
  )
  (func $text_i32 (param $s (ref $WasmStr)) (result (ref $Browser_Elmish_Html`1<i32>))
    i32.const 0
    local.get $s
    struct.new $Browser_Elmish_Html`1<i32>#0
  )
  (func $h1_i32 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<i32>))
    i32.const 104
    i32.const 49
    array.new_fixed $WasmStr 2
    local.get $attrs
    local.get $children
    call $el_i32
  )
  (func $p_i32 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<i32>))
    i32.const 112
    array.new_fixed $WasmStr 1
    local.get $attrs
    local.get $children
    call $el_i32
  )
  (func $onClick_i32 (param $msg i32) (result (ref $Browser_Elmish_Attr`1<i32>))
    i32.const 1
    local.get $msg
    struct.new $Browser_Elmish_Attr`1<i32>#1
  )
  (func $button_i32 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<i32>))
    i32.const 98
    i32.const 117
    i32.const 116
    i32.const 116
    i32.const 111
    i32.const 110
    array.new_fixed $WasmStr 6
    local.get $attrs
    local.get $children
    call $el_i32
  )
  (func $article_i32 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<i32>))
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
    call $el_i32
  )
  (func $view (param $model i32) (result (ref $Browser_Elmish_Html`1<i32>)) ;; exported as "view"
    i32.const 99
    i32.const 97
    i32.const 114
    i32.const 100
    array.new_fixed $WasmStr 4
    call $class$0027_i32
    ref.null $ListBase
    struct.new $ListCons_25
    ref.null $ListBase
    i32.const 72
    i32.const 101
    i32.const 108
    i32.const 108
    i32.const 111
    i32.const 32
    i32.const 102
    i32.const 114
    i32.const 111
    i32.const 109
    i32.const 32
    i32.const 70
    i32.const 35
    i32.const 32
    i32.const 111
    i32.const 110
    i32.const 32
    i32.const 87
    i32.const 97
    i32.const 115
    i32.const 109
    i32.const 71
    i32.const 67
    array.new_fixed $WasmStr 23
    call $text_i32
    ref.null $ListBase
    struct.new $ListCons_11
    call $h1_i32
    ref.null $ListBase
    i32.const 67
    i32.const 111
    i32.const 117
    i32.const 110
    i32.const 116
    i32.const 58
    i32.const 32
    array.new_fixed $WasmStr 7
    local.get $model
    call $intToStr
    call $strConcat
    call $text_i32
    ref.null $ListBase
    struct.new $ListCons_11
    call $p_i32
    i32.const 1
    call $onClick_i32
    ref.null $ListBase
    struct.new $ListCons_25
    i32.const 8722
    array.new_fixed $WasmStr 1
    call $text_i32
    ref.null $ListBase
    struct.new $ListCons_11
    call $button_i32
    i32.const 0
    call $onClick_i32
    ref.null $ListBase
    struct.new $ListCons_25
    i32.const 43
    array.new_fixed $WasmStr 1
    call $text_i32
    ref.null $ListBase
    struct.new $ListCons_11
    call $button_i32
    i32.const 2
    call $onClick_i32
    ref.null $ListBase
    struct.new $ListCons_25
    i32.const 114
    i32.const 101
    i32.const 115
    i32.const 101
    i32.const 116
    array.new_fixed $WasmStr 5
    call $text_i32
    ref.null $ListBase
    struct.new $ListCons_11
    call $button_i32
    ref.null $ListBase
    struct.new $ListCons_11
    struct.new $ListCons_11
    struct.new $ListCons_11
    struct.new $ListCons_11
    struct.new $ListCons_11
    return_call $article_i32
  )
  (func $closure_37 (param $self (ref $AnyFn)) (param $_arg i32)
  )
  (func $simple_i32~i32 (param $init i32) (param $update (ref $AnyFn)) (param $view (ref $AnyFn)) (param $noMsg i32) (result (ref $Browser_Elmish_Program`2<i32~i32>))
    local.get $init
    local.get $update
    local.get $view
    i32.const 0
    local.get $noMsg
    ref.func $closure_37
    struct.new $ClosureType_82
    struct.new $Browser_Elmish_Program`2<i32~i32>
  )
  (func $closure_42 (param $self (ref $AnyFn)) (param $model i32) (result i32)
    (local $self_cast (ref $ClosureType_86))
    (local $msg i32)
    local.get $self
    ref.cast (ref $ClosureType_86)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_86 1
    local.set $msg
    local.get $msg
    local.get $model
    return_call $update
  )
  (func $closure_41 (param $self (ref $AnyFn)) (param $msg i32) (result (ref $AnyFn))
    ref.func $closure_42
    local.get $msg
    struct.new $ClosureType_86
  )
  (func $closure_43 (param $self (ref $AnyFn)) (param $model_1 i32) (result (ref $Browser_Elmish_Html`1<i32>))
    local.get $model_1
    return_call $view
  )
  (func $closure_47 (param $self (ref $AnyFn)) (param $text (ref $WasmStr))
    (local $self_cast (ref $ClosureType_89))
    (local $handlers (ref $ResizeArray_36))
    (local $id i32)
    (local $model (ref $RefCell_66))
    (local $p (ref $Browser_Elmish_Program`2<i32~i32>))
    (local $render (ref $AnyFn))
    (local $ap_clo_48 (ref $AnyFn))
    (local $ap_arg_48_0 i32)
    (local $lo_clo_17 (ref $ClosureBase_41))
    (local $ap_arg_48_1 i32)
    (local $lo_clo_18 (ref $ClosureBase_50))
    (local $lo_clo_20 (ref $ClosureBase_52))
    (local $lo_clo_19 (ref $ClosureBase_31))
    (local $lo_clo_21 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_89)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_89 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_89 2
    local.set $id
    local.get $self_cast
    struct.get $ClosureType_89 3
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_89 4
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_89 5
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 1
    local.set $ap_clo_48
    local.get $handlers
    struct.get $ResizeArray_36 0
    ref.cast (ref $GcArray_35)
    local.get $id
    array.get $GcArray_35
    ref.cast (ref $AnyFn)
    ref.cast (ref $ClosureBase_41)
    local.set $lo_clo_17
    local.get $lo_clo_17
    local.get $text
    local.get $lo_clo_17
    struct.get $ClosureBase_41 0
    call_ref $FuncType_40
    local.set $ap_arg_48_0
    local.get $model
    struct.get $RefCell_66 0
    local.set $ap_arg_48_1
    local.get $ap_clo_48
    ref.test (ref $ClosureBase_50)
    if (result i32)
      local.get $ap_clo_48
      ref.cast (ref $ClosureBase_50)
      local.set $lo_clo_18
      local.get $lo_clo_18
      local.get $ap_arg_48_0
      local.get $ap_arg_48_1
      local.get $lo_clo_18
      struct.get $ClosureBase_50 0
      call_ref $FuncType_49
    else
      local.get $ap_clo_48
      ref.cast (ref $ClosureBase_31)
      local.set $lo_clo_19
      local.get $lo_clo_19
      local.get $ap_arg_48_0
      local.get $lo_clo_19
      struct.get $ClosureBase_31 0
      call_ref $FuncType_30
      ref.cast (ref $ClosureBase_52)
      local.set $lo_clo_20
      local.get $lo_clo_20
      local.get $ap_arg_48_1
      local.get $lo_clo_20
      struct.get $ClosureBase_52 0
      call_ref $FuncType_51
    end
    struct.set $RefCell_66 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_21
    local.get $lo_clo_21
    local.get $lo_clo_21
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $closure_46 (param $self (ref $AnyFn)) (param $id i32) (result (ref $AnyFn))
    (local $self_cast (ref $ClosureType_90))
    (local $handlers (ref $ResizeArray_36))
    (local $model (ref $RefCell_66))
    (local $p (ref $Browser_Elmish_Program`2<i32~i32>))
    (local $render (ref $AnyFn))
    local.get $self
    ref.cast (ref $ClosureType_90)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_90 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_90 2
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_90 3
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_90 4
    local.set $render
    ref.func $closure_47
    local.get $handlers
    local.get $id
    local.get $model
    local.get $p
    local.get $render
    struct.new $ClosureType_89
  )
  (func $letrec_render_45 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_91))
    (local $model (ref $RefCell_66))
    (local $p (ref $Browser_Elmish_Program`2<i32~i32>))
    (local $handlers (ref $ResizeArray_36))
    (local $sb (ref $StringBuilder))
    (local $lo_clo_22 (ref $ClosureBase_68))
    (local $lo_clo_23 (ref $ClosureBase_70))
    local.get $self
    ref.cast (ref $ClosureType_91)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_91 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_91 2
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
    struct.get $Browser_Elmish_Program`2<i32~i32> 2
    ref.cast (ref $ClosureBase_68)
    local.set $lo_clo_22
    local.get $lo_clo_22
    local.get $model
    struct.get $RefCell_66 0
    local.get $lo_clo_22
    struct.get $ClosureBase_68 0
    call_ref $FuncType_67
    call $renderTo_i32
    i32.const 0
    local.get $sb
    call $sbToString
    call $send
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 5
    ref.cast (ref $ClosureBase_70)
    local.set $lo_clo_23
    local.get $lo_clo_23
    local.get $model
    struct.get $RefCell_66 0
    local.get $lo_clo_23
    struct.get $ClosureBase_70 0
    call_ref $FuncType_69
    ref.func $closure_46
    local.get $handlers
    local.get $model
    local.get $p
    local.get $self
    struct.new $ClosureType_90
    global.set $handlerSlot
  )
  (func $closure_49 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_92))
    (local $model (ref $RefCell_66))
    (local $p (ref $Browser_Elmish_Program`2<i32~i32>))
    (local $render (ref $AnyFn))
    (local $ap_clo_50 (ref $AnyFn))
    (local $ap_arg_50_0 i32)
    (local $ap_arg_50_1 i32)
    (local $lo_clo_24 (ref $ClosureBase_50))
    (local $lo_clo_26 (ref $ClosureBase_52))
    (local $lo_clo_25 (ref $ClosureBase_31))
    (local $lo_clo_27 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_92)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_92 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_92 2
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_92 3
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 1
    local.set $ap_clo_50
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 4
    local.set $ap_arg_50_0
    local.get $model
    struct.get $RefCell_66 0
    local.set $ap_arg_50_1
    local.get $ap_clo_50
    ref.test (ref $ClosureBase_50)
    if (result i32)
      local.get $ap_clo_50
      ref.cast (ref $ClosureBase_50)
      local.set $lo_clo_24
      local.get $lo_clo_24
      local.get $ap_arg_50_0
      local.get $ap_arg_50_1
      local.get $lo_clo_24
      struct.get $ClosureBase_50 0
      call_ref $FuncType_49
    else
      local.get $ap_clo_50
      ref.cast (ref $ClosureBase_31)
      local.set $lo_clo_25
      local.get $lo_clo_25
      local.get $ap_arg_50_0
      local.get $lo_clo_25
      struct.get $ClosureBase_31 0
      call_ref $FuncType_30
      ref.cast (ref $ClosureBase_52)
      local.set $lo_clo_26
      local.get $lo_clo_26
      local.get $ap_arg_50_1
      local.get $lo_clo_26
      struct.get $ClosureBase_52 0
      call_ref $FuncType_51
    end
    struct.set $RefCell_66 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_27
    local.get $lo_clo_27
    local.get $lo_clo_27
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $run_i32~i32 (param $p (ref $Browser_Elmish_Program`2<i32~i32>))
    (local $model (ref $RefCell_66))
    (local $render (ref $ClosureType_91))
    (local $lo_clo_28 (ref $ClosureBase_5))
    (local $value i32)
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 0
    struct.new $RefCell_66
    local.set $model
    ref.func $letrec_render_45
    local.get $model
    local.get $p
    struct.new $ClosureType_91
    local.set $render
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_28
    local.get $lo_clo_28
    local.get $lo_clo_28
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
    local.get $p
    struct.get $Browser_Elmish_Program`2<i32~i32> 3
    i32.const 0
    i32.gt_s
    if
      local.get $p
      struct.get $Browser_Elmish_Program`2<i32~i32> 3
      ref.func $closure_49
      local.get $model
      local.get $p
      local.get $render
      struct.new $ClosureType_92
      call $every
      local.set $value
    end
  )
  (func $main ;; exported as "main"
    i32.const 0
    ref.func $closure_41
    struct.new $ClosureType_87
    ref.func $closure_43
    struct.new $ClosureType_88
    i32.const 2
    call $simple_i32~i32
    call $run_i32~i32
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
  (elem declare func $closure_1 $closure_13 $closure_14 $closure_17 $closure_2 $closure_3 $closure_37 $closure_41 $closure_42 $closure_43 $closure_46 $closure_47 $closure_49 $letrec_render_45)
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
  (export "update" (func $update))
  (export "view" (func $view))
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
