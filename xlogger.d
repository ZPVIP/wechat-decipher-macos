#!/usr/sbin/dtrace -w -s

#pragma D option quiet

BEGIN
{
    zero = (int *) alloca(4);
    *zero = 0;
}

/*
 * Set the global variable `gs_level' in xloggerbase.c to zero, so that
 * `xlogger_Level()' always return zero, enabling DEBUG level messages.
 *
 * TODO:
 *   1. Figure out why `gs_level' is automatically restored on exit.
 *   2. Decode the current instruction instead of hardcoding the offset.
 */
pid$target:WeChat:__xlogger_Level_impl:entry
{
    /* not sure why the `+ 10' is required */
    gs_level_addr = uregs[R_PC] + 0x1a414d6 + 10;
    copyout(zero, gs_level_addr, 4);
}

pid$target:WeChat:__xlogger_Write_impl:entry
{
    printf("%s\n", copyinstr(arg1));
}
